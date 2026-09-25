import { useEffect, useState } from "react";

import Toolbar from "./components/Toolbar";
import Legend from "./components/Legend";
import Breadcrumb from "./components/Breadcrumb";
import GroupedGraphCanvas from "./components/GroupedGraphCanvas";

import { fetchGroupedGraph } from "./api/graph";

import type { GroupedGraphResponse, GroupedNode } from "./types/graph";

interface Step {
  kind: "word" | "relation";
  value: string;
}

export default function App() {
  const [history, setHistory] = useState<Step[]>([
    { kind: "word", value: "dog" },
  ]);
  const [data, setData] = useState<GroupedGraphResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentWord =
    [...history].reverse().find((s) => s.kind === "word")?.value ?? "";

  const lastStep = history[history.length - 1];
  const activeRelation =
    lastStep?.kind === "relation"
      ? lastStep.value
      : (data?.groups[0]?.relation ?? null);

  // Derived loading state — true while the loaded data doesn't match the
  // requested word and no error has been recorded for this attempt.
  const loading =
    currentWord !== "" && data?.word !== currentWord && error === null;

  useEffect(() => {
    if (!currentWord) return;

    let cancelled = false;

    fetchGroupedGraph(currentWord)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Search failed");
      });

    return () => {
      cancelled = true;
    };
  }, [currentWord]);

  function search(word: string) {
    setHistory([{ kind: "word", value: word }]);
  }

  function selectRelation(relation: string) {
    setHistory((h) => {
      if (h[h.length - 1]?.kind === "relation") {
        return [...h.slice(0, -1), { kind: "relation", value: relation }];
      }
      return [...h, { kind: "relation", value: relation }];
    });
  }

  function navigateToNode(node: GroupedNode) {
    setHistory((h) => [...h, { kind: "word", value: node.label }]);
  }

  function navigateToStep(index: number) {
    setHistory((h) => h.slice(0, index + 1));
  }

  return (
    <div className="app">
      <Toolbar onSearch={search} loading={loading} />

      <Breadcrumb history={history} onNavigate={navigateToStep} />

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      <div className="canvas">
        {data && (
          <GroupedGraphCanvas
            data={data}
            activeRelation={activeRelation}
            onSelectNode={navigateToNode}
          />
        )}
      </div>

      {loading && <div className="canvas-loading">Loading…</div>}

      {data && (
        <Legend
          groups={data.groups}
          active={activeRelation}
          onSelect={selectRelation}
        />
      )}
    </div>
  );
}

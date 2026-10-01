import { useEffect, useState } from "react";

import Toolbar from "./components/Toolbar";
import Legend from "./components/Legend";
import Breadcrumb from "./components/Breadcrumb";
import GroupedGraphCanvas from "./components/GroupedGraphCanvas";
import TreeView from "./components/TreeView";
import PathView from "./components/PathView";
import NodePanel from "./components/NodePanel";

import { fetchGroupedGraph, fetchTree, fetchPath } from "./api/graph";

import type {
  GraphTreeResponse,
  GroupedGraphResponse,
  GroupedNode,
  PathAlgorithm,
  PathResponse,
  SelectableNode,
} from "./types/graph";

interface Step {
  kind: "word" | "relation";
  value: string;
}

type View = "grouped" | "tree" | "path";

export default function App() {
  const [history, setHistory] = useState<Step[]>([
    { kind: "word", value: "dog" },
  ]);
  const [data, setData] = useState<GroupedGraphResponse | null>(null);
  const [treeData, setTreeData] = useState<GraphTreeResponse | null>(null);
  const [pathData, setPathData] = useState<PathResponse | null>(null);
  const [view, setView] = useState<View>("grouped");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectableNode | null>(null);

  const currentWord =
    [...history].reverse().find((s) => s.kind === "word")?.value ?? "";

  const lastStep = history[history.length - 1];
  const activeRelation = lastStep?.kind === "relation" ? lastStep.value : null;

  useEffect(() => {
    if (!currentWord) return;

    let cancelled = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);

    fetchGroupedGraph(currentWord)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setSelected(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Search failed");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentWord]);

  function search(word: string) {
    setHistory([{ kind: "word", value: word }]);
    setSelected(null);
    setView("grouped");
  }

  function selectRelation(relation: string) {
    setHistory((h) => {
      const last = h[h.length - 1];

      if (last?.kind === "relation" && last.value === relation) {
        return h.slice(0, -1);
      }

      if (last?.kind === "relation") {
        return [...h.slice(0, -1), { kind: "relation", value: relation }];
      }
      return [...h, { kind: "relation", value: relation }];
    });
    setSelected(null);
  }

  function selectNode(node: SelectableNode) {
    setSelected(node);
  }

  function navigateToNode(node: SelectableNode) {
    setHistory((h) => [...h, { kind: "word", value: node.label ?? node.id }]);
    setSelected(null);
    setView("grouped");
    setTreeData(null);
    setPathData(null);
  }

  function navigateToStep(index: number) {
    setHistory((h) => h.slice(0, index + 1));
    setSelected(null);
  }

  function enterTreeView() {
    setLoading(true);
    setError(null);
    setView("tree");
    setTreeData(null);

    fetchTree(currentWord, 4)
      .then(setTreeData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Tree failed to load"),
      )
      .finally(() => setLoading(false));
  }

  function exitTreeView() {
    setView("grouped");
    setTreeData(null);
    setSelected(null);
  }

  function findPath(from: string, to: string, algorithm: PathAlgorithm) {
    setLoading(true);
    setError(null);
    setView("path");
    setPathData(null);
    setSelected(null);

    fetchPath(from, to, algorithm)
      .then(setPathData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Path failed to load"),
      )
      .finally(() => setLoading(false));
  }

  return (
    <div className="app">
      <Toolbar onSearch={search} onFindPath={findPath} loading={loading} />

      {view === "grouped" && (
        <Breadcrumb history={history} onNavigate={navigateToStep} />
      )}

      {view === "path" && pathData && pathData.path.length > 0 && (
        <Breadcrumb
          history={pathData.path.map((n) => ({
            kind: "word" as const,
            value: n.label ?? n.id,
          }))}
          onNavigate={(index) => {
            const step = pathData.path[index];
            if (step && step.label) {
              navigateToNode({
                id: step.id,
                label: step.label,
                definition: step.definition,
              });
            }
          }}
        />
      )}

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      <div className="canvas">
        {view === "grouped" && data && (
          <GroupedGraphCanvas
            data={data}
            activeRelation={activeRelation}
            onSelectNode={selectNode}
            onNavigateNode={navigateToNode}
          />
        )}

        {view === "tree" && treeData && (
          <TreeView
            data={treeData}
            onSelectNode={selectNode}
            onNavigateNode={navigateToNode}
          />
        )}

        {view === "path" && pathData && (
          <PathView data={pathData} onSelectNode={selectNode} />
        )}
      </div>

      {loading && <div className="canvas-loading">Loading…</div>}

      {view === "path" && pathData && (
        <div
          className={`path-info ${pathData.distance === null ? "path-none" : ""}`}
        >
          {pathData.distance === null ? (
            <>
              No path found between {pathData.start} and {pathData.end}
            </>
          ) : (
            <>
              Distance: {pathData.distance.toFixed(2)}
              {(1 / (1 + pathData.distance)).toFixed(3)}
            </>
          )}
        </div>
      )}

      {view === "grouped" && data && (
        <Legend
          groups={data.groups}
          active={activeRelation}
          onSelect={selectRelation}
          onShowTree={enterTreeView}
        />
      )}

      {view === "tree" && (
        <div className="legend">
          <button className="legend-back" onClick={exitTreeView}>
            ← Back to browse
          </button>
          <div className="tree-hint">Click any node to explore from there</div>
        </div>
      )}

      {selected && (
        <NodePanel
          node={selected}
          onClose={() => setSelected(null)}
          onExplore={() =>
            navigateToNode({
              id: selected.id,
              label: selected.label,
              rank: 0,
            } as GroupedNode)
          }
        />
      )}
    </div>
  );
}

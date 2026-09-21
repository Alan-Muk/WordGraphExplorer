import { useState } from "react";

import Toolbar from "./components/Toolbar";
import StatsCard from "./components/StatsCard";
import Legend from "./components/Legend";
import GraphCanvas from "./components/GraphCanvas";
import NodePanel from "./components/NodePanel";

import { fetchGraph } from "./api/graph";

import type { GraphResponse, GraphNode } from "./types/graph";

export default function App() {
  const [graph, setGraph] = useState<GraphResponse | null>(null);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(word: string, depth: number) {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchGraph(word, depth);
      setGraph(result);
      setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <Toolbar onSearch={search} loading={loading} />

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      {graph && (
        <StatsCard nodes={graph.stats.nodes} edges={graph.stats.edges} />
      )}

      <div className="canvas">
        {graph && (
          <GraphCanvas
            graph={graph}
            selectedId={selected?.id ?? null}
            onSelect={(node) => setSelected(node)}
          />
        )}

        {selected && graph && (
          <NodePanel
            node={selected}
            nodes={graph.nodes}
            edges={graph.edges}
            onClose={() => setSelected(null)}
          />
        )}
      </div>

      <Legend />
    </div>
  );
}

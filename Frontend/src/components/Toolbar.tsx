import { useState } from "react";
import type { PathAlgorithm } from "../types/graph";

type Mode = "explore" | "path";

interface Props {
  onSearch: (word: string) => void;
  onFindPath: (from: string, to: string, algorithm: PathAlgorithm) => void;
  loading?: boolean;
}

export default function Toolbar({
  onSearch,
  onFindPath,
  loading = false,
}: Props) {
  const [mode, setMode] = useState<Mode>("explore");
  const [word, setWord] = useState("dog");
  const [from, setFrom] = useState("dog");
  const [to, setTo] = useState("cat");
  const [algorithm, setAlgorithm] = useState<PathAlgorithm>("dijkstra");

  function submitExplore() {
    const trimmed = word.trim();
    if (!trimmed || loading) return;
    onSearch(trimmed);
  }

  function submitPath() {
    const f = from.trim();
    const t = to.trim();
    if (!f || !t || loading) return;
    onFindPath(f, t, algorithm);
  }

  return (
    <div className="toolbar">
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as Mode)}
        disabled={loading}
        aria-label="Mode"
      >
        <option value="explore">Explore</option>
        <option value="path">Path</option>
      </select>

      {mode === "explore" ? (
        <>
          <input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitExplore()}
            placeholder="Search concept..."
            disabled={loading}
          />
          <button onClick={submitExplore} disabled={loading}>
            {loading ? "Loading…" : "Explore"}
          </button>
        </>
      ) : (
        <>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitPath()}
            placeholder="From..."
            disabled={loading}
            className="path-input"
          />
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitPath()}
            placeholder="To..."
            disabled={loading}
            className="path-input"
          />
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as PathAlgorithm)}
            disabled={loading}
            aria-label="Algorithm"
          >
            <option value="dijkstra">Dijkstra</option>
            <option value="bfs">BFS</option>
          </select>
          <button onClick={submitPath} disabled={loading}>
            {loading ? "Loading…" : "Find"}
          </button>
        </>
      )}
    </div>
  );
}

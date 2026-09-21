import { useState } from "react";

interface Props {
  onSearch: (word: string, depth: number) => void;
  loading?: boolean;
}

export default function Toolbar({ onSearch, loading = false }: Props) {
  const [word, setWord] = useState("dog");
  const [depth, setDepth] = useState(2);

  function submit() {
    const trimmed = word.trim();
    if (!trimmed || loading) {
      return;
    }
    onSearch(trimmed, depth);
  }

  return (
    <div className="toolbar">
      <input
        value={word}
        onChange={(e) => setWord(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
        placeholder="Search concept..."
        disabled={loading}
      />

      <select
        value={depth}
        onChange={(e) => setDepth(Number(e.target.value))}
        disabled={loading}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            Depth {n}
          </option>
        ))}
      </select>

      <button onClick={submit} disabled={loading}>
        {loading ? "Loading…" : "Explore"}
      </button>
    </div>
  );
}

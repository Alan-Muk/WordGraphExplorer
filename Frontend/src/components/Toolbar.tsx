import { useState } from "react";

interface Props {
  onSearch: (word: string) => void;
  loading?: boolean;
}

export default function Toolbar({ onSearch, loading = false }: Props) {
  const [word, setWord] = useState("dog");

  function submit() {
    const trimmed = word.trim();
    if (!trimmed || loading) return;
    onSearch(trimmed);
  }

  return (
    <div className="toolbar">
      <input
        value={word}
        onChange={(e) => setWord(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder="Search concept..."
        disabled={loading}
      />
      <button onClick={submit} disabled={loading}>
        {loading ? "Loading…" : "Explore"}
      </button>
    </div>
  );
}

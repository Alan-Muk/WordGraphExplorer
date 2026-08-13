import { useState } from "react";

interface Props {
  onSearch: (word: string, depth: number) => void;
}

export default function Toolbar({ onSearch }: Props) {
  const [word, setWord] = useState("dog");
  const [depth, setDepth] = useState(2);

  function submit() {
    onSearch(word, depth);
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
      />

      <select value={depth} onChange={(e) => setDepth(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            Depth {n}
          </option>
        ))}
      </select>

      <button onClick={submit}>Explore</button>
    </div>
  );
}

const relations = [
  ["hypernym", "#38bdf8"],
  ["hyponym", "#22c55e"],
  ["meronym", "#fb923c"],
  ["holonym", "#c084fc"],
  ["antonym", "#ef4444"],
];

export default function Legend() {
  return (
    <div className="legend">
      {relations.map(([name, color]) => (
        <div key={name}>
          <span
            style={{
              background: color,
            }}
          />

          {name}
        </div>
      ))}
    </div>
  );
}

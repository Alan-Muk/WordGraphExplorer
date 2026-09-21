import { RELATION_COLORS } from "../constants/relations";

export default function Legend() {
  return (
    <div className="legend">
      {Object.entries(RELATION_COLORS).map(([name, color]) => (
        <div key={name}>
          <span style={{ background: color }} />
          {name}
        </div>
      ))}
    </div>
  );
}

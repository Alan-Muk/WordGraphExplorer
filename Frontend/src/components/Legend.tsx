import { RELATION_COLORS } from "../constants/relations";
import type { RelationGroup } from "../types/graph";

interface Props {
  groups: RelationGroup[];
  active: string | null;
  onSelect: (relation: string) => void;
}

export default function Legend({ groups, active, onSelect }: Props) {
  if (groups.length === 0) return null;

  return (
    <div className="legend interactive">
      {groups.map((group) => {
        const color = RELATION_COLORS[group.relation] ?? "#94a3b8";
        const isActive = group.relation === active;
        const shown = group.nodes.length;
        const capped = group.total > shown;

        return (
          <div
            key={group.relation}
            className={`legend-row ${isActive ? "active" : ""}`}
            onClick={() => onSelect(group.relation)}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(group.relation);
              }
            }}
          >
            <span className="legend-swatch" style={{ background: color }} />
            <span className="legend-label">{group.relation}</span>
            <span
              className="legend-count"
              aria-label={
                capped
                  ? `${shown} of ${group.total} shown`
                  : `${group.total} total`
              }
            >
              {capped ? `${shown}/${group.total}` : group.total}
            </span>
          </div>
        );
      })}
    </div>
  );
}

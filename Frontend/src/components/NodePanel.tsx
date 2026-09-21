import type { GraphNode, GraphEdge } from "../types/graph";
import { RELATION_COLORS } from "../constants/relations";

interface Props {
  node: GraphNode | null;
  nodes: GraphNode[];
  edges: GraphEdge[];
  onClose: () => void;
}

export default function NodePanel({ node, nodes, edges, onClose }: Props) {
  if (!node) {
    return null;
  }

  const relations = edges
    .filter((edge) => edge.source === node.id)
    .map((edge) => {
      const target = nodes.find((n) => n.id === edge.target);
      return {
        type: edge.label,
        target: target?.label ?? edge.target,
      };
    });

  return (
    <aside className="node-panel">
      <button className="close" onClick={onClose} aria-label="Close">
        ×
      </button>

      <h2>{node.label}</h2>

      <p className="definition">
        {node.definition ?? "No definition available"}
      </p>

      <hr />

      <h3>Relations</h3>

      {relations.length === 0 && <p>No relations</p>}

      {relations.map((relation) => (
        <div className="relation" key={`${relation.type}-${relation.target}`}>
          <span
            className="relation-type"
            style={{ color: RELATION_COLORS[relation.type] ?? "#94a3b8" }}
          >
            {relation.type}
          </span>
          →<strong>{relation.target}</strong>
        </div>
      ))}
    </aside>
  );
}

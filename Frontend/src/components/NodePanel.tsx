import type { SelectableNode } from "../types/graph";

interface Props {
  node: SelectableNode;
  onClose: () => void;
  onExplore: () => void;
}

export default function NodePanel({ node, onClose, onExplore }: Props) {
  return (
    <aside className="node-panel">
      <button className="close" onClick={onClose} aria-label="Close">
        ×
      </button>

      <h2>{node.label}</h2>

      <p className="definition">
        {node.definition ?? "No definition available"}
      </p>

      <button className="explore-button" onClick={onExplore}>
        Explore this word →
      </button>
    </aside>
  );
}

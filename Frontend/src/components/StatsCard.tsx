interface Props {
  nodes: number;
  edges: number;
}

export default function StatsCard({ nodes, edges }: Props) {
  return (
    <div className="stats">
      <div>
        Nodes
        <strong>{nodes}</strong>
      </div>

      <div>
        Edges
        <strong>{edges}</strong>
      </div>
    </div>
  );
}

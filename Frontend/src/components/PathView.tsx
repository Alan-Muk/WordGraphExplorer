import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import { RELATION_COLORS } from "../constants/relations";

import type { PathResponse, SelectableNode } from "../types/graph";

interface Props {
  data: PathResponse;
  onSelectNode: (node: SelectableNode) => void;
}

export default function PathView({ data, onSelectNode }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const onSelectRef = useRef(onSelectNode);
  const dataRef = useRef(data);

  useEffect(() => {
    onSelectRef.current = onSelectNode;
  }, [onSelectNode]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (!container.current) return;

    const cy = cytoscape({
      container: container.current,
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            width: 30,
            height: 30,
            "font-size": 10,
            color: "#e5e7eb",
            "text-valign": "bottom",
            "text-margin-y": 6,
            "background-color": "#64748b",
            "border-width": 1,
            "border-color": "#cbd5e1",
            "text-wrap": "wrap",
            "text-max-width": "100px",
          },
        },
        {
          selector: "node.endpoint",
          style: {
            width: 42,
            height: 42,
            "font-size": 13,
            "font-weight": 600,
            "background-color": "#facc15",
            "border-color": "#fde68a",
            "border-width": 3,
            color: "#facc15",
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "arrow-scale": 0.6,
            "line-opacity": 0.85,
          },
        },
        ...Object.entries(RELATION_COLORS).map(([label, color]) => ({
          selector: `edge[label="${label}"]`,
          style: {
            "line-color": color,
            "target-arrow-color": color,
          },
        })),
      ],
      layout: { name: "preset" },
      wheelSensitivity: 0.75,
      minZoom: 0.3,
      maxZoom: 3,
      autoungrabify: true,
    });

    cyRef.current = cy;

    cy.on("tap", "node", (event) => {
      const nodeId = event.target.id();
      const node = dataRef.current.path.find((n) => n.id === nodeId);
      if (node) onSelectRef.current(node);
    });

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, []);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().remove();

    if (data.path.length === 0) return;

    const spacing = 150;
    const startX = 100;

    cy.batch(() => {
      data.path.forEach((node, index) => {
        cy.add({
          group: "nodes",
          data: { id: node.id, label: node.label ?? node.id },
          position: { x: startX + index * spacing, y: 300 },
          classes:
            index === 0 || index === data.path.length - 1 ? "endpoint" : "",
        });
      });

      for (const edge of data.edges) {
        cy.add({
          group: "edges",
          data: {
            id: `${edge.source}__${edge.target}`,
            source: edge.source,
            target: edge.target,
            label: edge.relation,
          },
        });
      }
    });

    cy.fit(undefined, 60);
  }, [data]);

  return <div ref={container} className="grouped-canvas" />;
}

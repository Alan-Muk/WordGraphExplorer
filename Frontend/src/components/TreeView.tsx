import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import { RELATION_COLORS } from "../constants/relations";
import type { GraphTreeResponse, TreeNode } from "../types/graph";

interface Props {
  data: GraphTreeResponse;
  onSelectNode: (node: TreeNode) => void;
  onNavigateNode: (node: TreeNode) => void;
}

export default function TreeView({
  data,
  onSelectNode,
  onNavigateNode,
}: Props) {
  const container = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const onSelectRef = useRef(onSelectNode);
  const onNavigateRef = useRef(onNavigateNode);
  const dataRef = useRef(data);

  useEffect(() => {
    onSelectRef.current = onSelectNode;
  }, [onSelectNode]);

  useEffect(() => {
    onNavigateRef.current = onNavigateNode;
  }, [onNavigateNode]);

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
            width: 22,
            height: 22,
            "font-size": 9,
            color: "#e5e7eb",
            "text-valign": "bottom",
            "text-margin-y": 5,
            "background-color": "#64748b",
            "border-width": 1,
            "border-color": "#cbd5e1",
            "text-wrap": "wrap",
            "text-max-width": "90px",
          },
        },
        {
          selector: "node.root",
          style: {
            width: 40,
            height: 40,
            "font-size": 13,
            "font-weight": 600,
            "background-color": "#facc15",
            "border-color": "#fde68a",
            "border-width": 3,
            color: "#facc15",
          },
        },
        // Layer-specific sizing: deeper nodes are smaller.
        {
          selector: "node.layer-1",
          style: { width: 28, height: 28, "font-size": 10 },
        },
        {
          selector: "node.layer-2",
          style: { width: 24, height: 24, "font-size": 9 },
        },
        {
          selector: "node.layer-3",
          style: { width: 20, height: 20, "font-size": 8 },
        },
        {
          selector: "node.layer-4",
          style: { width: 16, height: 16, "font-size": 7 },
        },
        {
          selector: "edge",
          style: {
            width: 1.5,
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "arrow-scale": 0.5,
            "line-opacity": 0.7,
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
      minZoom: 0.15,
      maxZoom: 4,
      autoungrabify: true,
    });

    cyRef.current = cy;

    cy.on("tap", "node", (event) => {
      const nodeId = event.target.id();
      const node = dataRef.current.nodes.find((n) => n.id === nodeId);
      if (node) {
        onSelectRef.current(node);
      }
    });

    let tapTimeout: number | null = null;

    cy.on("tap", "node", (event) => {
      const nodeId = event.target.id();
      if (tapTimeout !== null) window.clearTimeout(tapTimeout);

      tapTimeout = window.setTimeout(() => {
        tapTimeout = null;
        const node = dataRef.current.nodes.find((n) => n.id === nodeId);
        if (node) onSelectRef.current(node);
      }, 250);
    });

    cy.on("dbltap", "node", (event) => {
      if (tapTimeout !== null) {
        window.clearTimeout(tapTimeout);
        tapTimeout = null;
      }
      const nodeId = event.target.id();
      const node = dataRef.current.nodes.find((n) => n.id === nodeId);
      if (node) onNavigateRef.current(node);
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

    cy.batch(() => {
      for (const node of data.nodes) {
        const classes =
          node.id === data.root.id ? "root" : `layer-${node.layer}`;
        cy.add({
          group: "nodes",
          data: { id: node.id, label: node.label },
          classes,
        });
      }

      for (const edge of data.edges) {
        cy.add({
          group: "edges",
          data: {
            id: `${edge.source}__${edge.target}__${edge.relation}`,
            source: edge.source,
            target: edge.target,
            label: edge.relation,
          },
        });
      }
    });

    cy.layout({
      name: "breadthfirst",
      directed: true,
      circle: true,
      spacingFactor: 1.6,
      fit: true,
      padding: 80,
      animate: false,
    } as unknown as cytoscape.LayoutOptions).run();
  }, [data]);

  return <div ref={container} className="grouped-canvas" />;
}

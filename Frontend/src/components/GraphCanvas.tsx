import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import cola from "cytoscape-cola";

import { fetchGraph } from "../api/graph";
import type { GraphResponse, GraphNode } from "../types/graph";

cytoscape.use(cola);

interface Props {
  graph: GraphResponse;
  selectedId?: string | null;
  onSelect: (node: GraphNode) => void;
}

export default function GraphCanvas({ graph, selectedId, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);

  const cyRef = useRef<cytoscape.Core | null>(null);

  const onSelectRef = useRef(onSelect);

  const destroyedRef = useRef(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!container.current) {
      return;
    }

    destroyedRef.current = false;

    const cy = cytoscape({
      container: container.current,

      style: [
        {
          selector: "node",

          style: {
            label: "data(label)",

            width: 22,

            height: 22,

            "font-size": 8,

            color: "#e5e7eb",

            "text-valign": "bottom",

            "text-margin-y": 5,

            "background-color": "#64748b",

            "border-width": 1,

            "border-color": "#cbd5e1",
          },
        },

        {
          selector: "edge",

          style: {
            width: 1,

            "curve-style": "bezier",

            "target-arrow-shape": "triangle",

            "arrow-scale": 0.4,

            "line-opacity": 0.7,
          },
        },

        {
          selector: 'edge[label="hypernym"]',

          style: {
            "line-color": "#38bdf8",
            "target-arrow-color": "#38bdf8",
          },
        },

        {
          selector: 'edge[label="hyponym"]',

          style: {
            "line-color": "#22c55e",
            "target-arrow-color": "#22c55e",
          },
        },

        {
          selector: 'edge[label="meronym"]',

          style: {
            "line-color": "#fb923c",
            "target-arrow-color": "#fb923c",
          },
        },

        {
          selector: 'edge[label="holonym"]',

          style: {
            "line-color": "#c084fc",
            "target-arrow-color": "#c084fc",
          },
        },

        {
          selector: 'edge[label="antonym"]',

          style: {
            "line-color": "#ef4444",
            "target-arrow-color": "#ef4444",
          },
        },

        {
          selector: ".highlight",

          style: {
            "background-color": "#facc15",
            "line-color": "#facc15",
            "target-arrow-color": "#facc15",
          },
        },

        {
          selector: ".faded",

          style: {
            opacity: 0.12,
          },
        },

        {
          selector: ".selected-node",

          style: {
            "background-color": "#facc15",
            "border-color": "#fde68a",
            "border-width": 3,
          },
        },
      ],

      layout: {
        name: "preset",
      },

      wheelSensitivity: 0.75,

      autoungrabify: false,

      autolock: false,

      motionBlur: true,

      minZoom: 0.15,

      maxZoom: 4,
    });

    cyRef.current = cy;

    cy.on("tap", "node", (event) => {
      const node = event.target;

      onSelectRef.current(node.data() as GraphNode);
    });

    cy.on("mouseover", "node", (event) => {
      cy.elements().removeClass("highlight");

      event.target.addClass("highlight");

      event.target.connectedEdges().addClass("highlight");

      event.target.neighborhood().addClass("highlight");
    });

    cy.on("mouseout", () => {
      cy.elements().removeClass("highlight");
    });

    cy.on("dbltap", "node", async (event) => {
      const node = event.target;

      const word = node.data("label");

      const expanded = await fetchGraph(word, 1);

      if (destroyedRef.current) {
        return;
      }

      const center = node.position();

      const existing = new Set(cy.nodes().map((n) => n.id()));

      cy.batch(() => {
        expanded.nodes.forEach((newNode) => {
          if (existing.has(newNode.id)) {
            return;
          }

          cy.add({
            group: "nodes",

            data: {
              ...newNode,

              id: newNode.id,

              label: newNode.label,
            },

            position: {
              x: center.x + (Math.random() - 0.5) * 180,

              y: center.y + (Math.random() - 0.5) * 180,
            },
          });
        });

        expanded.edges.forEach((edge) => {
          const id = `${edge.source}-${edge.target}-${edge.label}`;

          if (cy.getElementById(id).length) {
            return;
          }

          if (
            !cy.getElementById(edge.source).length ||
            !cy.getElementById(edge.target).length
          ) {
            return;
          }

          cy.add({
            group: "edges",

            data: {
              id,

              source: edge.source,

              target: edge.target,

              label: edge.label,

              weight: edge.weight,
            },
          });
        });
      });

      cy.animate({
        center: {
          eles: node,
        },

        duration: 400,
      });
    });

    return () => {
      destroyedRef.current = true;

      cy.destroy();

      cyRef.current = null;
    };
  }, []);

  useEffect(() => {
    const cy = cyRef.current;

    if (!cy) {
      return;
    }

    cy.batch(() => {
      graph.nodes.forEach((node) => {
        if (cy.getElementById(node.id).length) {
          return;
        }

        cy.add({
          group: "nodes",

          data: {
            ...node,

            id: node.id,

            label: node.label,
          },
        });
      });

      graph.edges.forEach((edge) => {
        const id = `${edge.source}-${edge.target}-${edge.label}`;

        if (cy.getElementById(id).length) {
          return;
        }

        cy.add({
          group: "edges",

          data: {
            id,

            source: edge.source,

            target: edge.target,

            label: edge.label,

            weight: edge.weight,
          },
        });
      });
    });

    cy.layout({
      name: "cola",

      animate: true,

      fit: true,

      padding: 50,

      avoidOverlap: true,

      edgeLength: 120,

      nodeSpacing: 25,

      maxSimulationTime: 2000,
    }).run();
  }, [graph]);

  useEffect(() => {
    const cy = cyRef.current;

    if (!cy) {
      return;
    }

    cy.elements().removeClass("selected-node faded");

    if (!selectedId) {
      return;
    }

    const node = cy.getElementById(selectedId);

    if (!node.length) {
      return;
    }

    const neighbourhood = node.closedNeighborhood();

    cy.elements().difference(neighbourhood).addClass("faded");

    neighbourhood.addClass("selected-node");

    cy.animate({
      center: {
        eles: node,
      },

      duration: 500,
    });
  }, [selectedId]);

  return (
    <div
      ref={container}

      style={{
        width: "100vw",

        height: "100vh",

        background: "#020617",
      }}
    />
  );
}

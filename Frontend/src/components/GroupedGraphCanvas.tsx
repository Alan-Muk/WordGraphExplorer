import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import cola from "cytoscape-cola";
import { RELATION_COLORS } from "../constants/relations";
import type {
  GroupedGraphResponse,
  GroupedNode,
  RelationGroup,
} from "../types/graph";

cytoscape.use(cola);

type ColaLayoutOptions = cytoscape.LayoutOptions & {
  animate?: boolean;
  avoidOverlap?: boolean;
  edgeLength?: number;
  nodeSpacing?: number;
  maxSimulationTime?: number;
};

interface Props {
  data: GroupedGraphResponse;
  activeRelation: string | null;
  onSelectNode: (node: GroupedNode) => void;
}

export default function GroupedGraphCanvas({
  data,
  activeRelation,
  onSelectNode,
}: Props) {
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
            width: 26,
            height: 26,
            "font-size": 9,
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
          selector: "node.root",
          style: {
            width: 40,
            height: 40,
            "font-size": 12,
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
            width: 1.5,
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "arrow-scale": 0.6,
            "line-opacity": 0.8,
          },
        },
        ...Object.entries(RELATION_COLORS).map(([label, color]) => ({
          selector: `edge[label="${label}"]`,
          style: {
            "line-color": color,
            "target-arrow-color": color,
          },
        })),
        {
          selector: ".dimmed",
          style: {
            opacity: 0.35,
          },
        },
      ],
      layout: { name: "preset" },
      wheelSensitivity: 0.75,
      minZoom: 0.2,
      maxZoom: 3,
    });

    cyRef.current = cy;

    cy.on("tap", "node", (event) => {
      const nodeId = event.target.id();
      if (nodeId === dataRef.current.root.id) return;

      const node = findNodeInGroups(dataRef.current, nodeId);
      if (node) {
        onSelectRef.current(node);
      }
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

    const activeGroup: RelationGroup | undefined =
      (activeRelation
        ? data.groups.find((g) => g.relation === activeRelation)
        : data.groups[0]) ?? undefined;

    cy.batch(() => {
      cy.add({
        group: "nodes",
        data: { id: data.root.id, label: data.root.label },
        classes: "root",
      });

      if (activeGroup) {
        for (const node of activeGroup.nodes) {
          cy.add({
            group: "nodes",
            data: { id: node.id, label: node.label },
          });

          cy.add({
            group: "edges",
            data: {
              id: `${data.root.id}__${node.id}__${activeGroup.relation}`,
              source: data.root.id,
              target: node.id,
              label: activeGroup.relation,
            },
          });
        }
      }
    });

    cy.layout({
      name: "cola",
      animate: true,
      fit: true,
      padding: 80,
      avoidOverlap: true,
      edgeLength: 160,
      nodeSpacing: 40,
      maxSimulationTime: 1500,
    } as ColaLayoutOptions).run();
  }, [data, activeRelation]);

  return <div ref={container} className="grouped-canvas" />;
}

function findNodeInGroups(
  data: GroupedGraphResponse,
  nodeId: string,
): GroupedNode | undefined {
  for (const group of data.groups) {
    const found = group.nodes.find((n) => n.id === nodeId);
    if (found) return found;
  }
  return undefined;
}

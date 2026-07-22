import { GraphEdge } from "./GraphEdge";

export interface GraphNode {
  id: string;
  label: string;
  definition?: string;
}

export interface GraphResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
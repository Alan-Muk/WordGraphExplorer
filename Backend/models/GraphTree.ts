import type { RelationType } from "./Relations";

export interface TreeNode {
  id: string;
  label: string;
  definition?: string;
  rank: number;
  /** Depth from the root. 0 for the root itself. */
  layer: number;
}

export interface TreeEdge {
  source: string;
  target: string;
  relation: RelationType;
}

export interface GraphTree {
  word: string;
  root: TreeNode;
  nodes: TreeNode[];
  edges: TreeEdge[];
}

import type { RelationType } from "./Relations";

export interface GroupedNode {
  id: string;
  label: string;
  definition?: string;
}

export interface RelationGroup {
  relation: RelationType;
  total: number;
  nodes: GroupedNode[];
}

export interface GroupedGraph {
  word: string;
  root: GroupedNode;
  groups: RelationGroup[];
}

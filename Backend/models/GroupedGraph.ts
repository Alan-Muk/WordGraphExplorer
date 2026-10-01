import type { RelationType } from "./Relations";

export interface GroupedNode {
  id: string;
  label: string;
  definition?: string;
  /** WordNet tagsense count for this synset's first lemma. 0 if untagged. */
  rank: number;
}

export interface RelationGroup {
  relation: RelationType;
  /** Total number of nodes before the cap. */
  total: number;
  /** The highest-ranked node in the group — used for the landing view. */
  top: GroupedNode;
  /** Up to `limit` nodes, sorted by degree (desc), then label. */
  nodes: GroupedNode[];
}

export interface GroupedGraph {
  word: string;
  root: GroupedNode;
  groups: RelationGroup[];
}

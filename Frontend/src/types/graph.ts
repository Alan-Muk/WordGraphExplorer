export const DEPTH_OPTIONS = [1, 2, 3, 4, 5] as const;
export const DEFAULT_DEPTH = 2;

export interface GraphNode {
  id: string;

  label: string;

  definition?: string;

  examples?: string[];

  pos?: string;

  synset?: string;

  lemmas?: string[];
}

export interface GraphEdge {
  source: string;

  target: string;

  label: string;

  weight: number;
}

export interface GraphResponse {
  word: string;

  nodes: GraphNode[];

  edges: GraphEdge[];

  stats: {
    nodes: number;

    edges: number;
  };
}

export interface PathNode {
  id: string;
  label?: string;
  definition?: string;
}

export interface PathResponse {
  start: string;
  end: string;
  distance: number | null;
  path: PathNode[];
}

export interface SimilarityResponse {
  from: string;
  to: string;
  distance: number | null;
  similarity: number;
  path: PathNode[];
}

export interface SearchResult {
  id: string;
  word: string;
  pos: string;
  definition: string;
}

export interface SearchResponse {
  word: string;
  results: SearchResult[];
}

export interface GroupedNode {
  id: string;
  label: string;
  definition?: string;
  pos?: string;
}

export interface RelationGroup {
  relation: string;
  total: number;
  nodes: GroupedNode[];
}

export interface GroupedGraphResponse {
  word: string;
  root: GroupedNode;
  groups: RelationGroup[];
}

/*
 * Graph data type definitions:
 *
 * GraphNode represents a word or concept in the graph, including
 * optional linguistic information such as definitions, examples,
 * part of speech, synsets, and lemmas.
 *
 * GraphEdge represents a relationship between two graph nodes,
 * including the relationship label and its weight.
 *
 * GraphResponse represents the complete graph returned by the API,
 * containing the requested word, its nodes and edges, and summary
 * statistics for the total number of nodes and edges.
 */

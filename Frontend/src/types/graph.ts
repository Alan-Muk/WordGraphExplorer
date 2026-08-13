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

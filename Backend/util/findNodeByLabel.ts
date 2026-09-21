import { Graph } from "../engine/Graph";

/**
 * Finds a node in the graph by matching its label against `word`.
 *
 * Prefers an exact case-insensitive match; falls back to a substring match
 * if no exact match exists. This is a deliberate trade-off: exact matches
 * give the user the word they typed, and the substring fallback handles
 * cases where the synset's canonical lemma differs slightly from the input
 * (e.g. "domestic dog" vs. "domestic_dog").
 */
export function findNodeByLabel(graph: Graph, word: string) {
  const lower = word.toLowerCase();
  const nodes = graph.getNodes();

  return (
    nodes.find((n) => n.label.toLowerCase() === lower) ??
    nodes.find((n) => n.label.toLowerCase().includes(lower))
  );
}

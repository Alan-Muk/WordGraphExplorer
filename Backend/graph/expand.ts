import { fetchNode } from "../services/conceptnet";
import { buildGraph } from "./builder";
import pLimit from "p-limit";

const limit = pLimit(5); // concurrency control

const ALLOWED = new Set([
  "IsA",
  "UsedFor",
  "CapableOf",
  "PartOf",
  "HasProperty",
  "Causes",
  "RelatedTo"
]);

type Cache = Map<string, any>;

export async function expandGraph(
  root: string,
  depth = 2,
  cache: Cache = new Map()
) {
  const nodes = new Map<string, any>();
  const edges: any[] = [];

  async function explore(word: string, d: number) {
    if (d > depth) return;

    if (cache.has(word)) {
      const cached = cache.get(word);
      merge(cached);
      return;
    }

    const data = await fetchNode(word);
    cache.set(word, data);

    const { nodes: newNodes, edges: newEdges } = buildGraph(data);

    merge({ nodes: newNodes, edges: newEdges });

    const nextWords = newEdges
      .slice(0, 20) // limit branching
      .map(e => e.data.target);

    await Promise.all(
      nextWords.map(w =>
        limit(() => explore(w, d + 1))
      )
    );
  }

  function merge(graph: any) {
    for (const n of graph.nodes) {
      nodes.set(n.data.id, n);
    }
    for (const e of graph.edges) {
      edges.push(e);
    }
  }

  await explore(root, 0);

  return {
    center: root,
    nodes: Array.from(nodes.values()),
    edges
  };
}

/**
 * Expands a semantic graph by recursively exploring related concepts
 * from a given root node.
 *
 * Starting from the root concept, this function fetches ConceptNet data,
 * converts it into graph nodes and edges, and recursively traverses
 * connected concepts up to the specified depth. Results are cached to
 * prevent duplicate API requests, and concurrent requests are limited
 * to improve performance while avoiding excessive network usage.
 *
 * Features:
 * - Recursive graph expansion with configurable depth.
 * - In-memory caching of fetched concepts.
 * - Concurrency limiting using `p-limit`.
 * - Merges discovered nodes and edges into a single graph.
 * - Restricts branching to the first 20 connected concepts per node.
 *
 * @param root - The starting concept for graph expansion.
 * @param depth - Maximum recursion depth (default: `2`).
 * @param cache - Optional cache storing previously fetched concepts.
 * @returns A graph object containing:
 *   - `center`: The root concept.
 *   - `nodes`: Unique graph nodes.
 *   - `edges`: Graph edges connecting the nodes.
 
   * Recursively explores a concept and its neighboring concepts.
   *
   * Stops when the maximum depth is reached, reuses cached data when
   * available, fetches new concept data otherwise, and schedules
   * exploration of neighboring concepts while respecting the
   * configured concurrency limit.
   *
   * @param word - The concept currently being explored.
   * @param d - Current recursion depth.
   

   * Merges nodes and edges from a subgraph into the accumulated graph.
   *
   * Nodes are stored in a map to ensure uniqueness, while edges are
   * appended to the resulting edge list.
   *
   * @param graph - Graph containing `nodes` and `edges` to merge.
   */

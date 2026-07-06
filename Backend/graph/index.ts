export function buildAdjacency(edges: any[]) {
  const graph = new Map<string, { node: string; weight: number }[]>();

  for (const e of edges) {
    const { source, target, weight } = e.data;

    if (!graph.has(source)) graph.set(source, []);
    if (!graph.has(target)) graph.set(target, []);

    graph.get(source)!.push({ node: target, weight });
    graph.get(target)!.push({ node: source, weight }); // undirected
  }

  return graph;
}

/**
 * Builds an adjacency list representation of an undirected weighted graph.
 *
 * Iterates through the provided edges and creates a map where each node
 * is associated with a list of its neighboring nodes and the weight of
 * the connecting edge. Since the graph is undirected, each edge is added
 * in both directions.
 *
 * @param edges - Array of edge objects containing `source`, `target`,
 * and `weight` properties within their `data` field.
 * @returns A Map where:
 *   - Key: Node ID (`string`)
 *   - Value: Array of adjacent nodes with their edge weights
 *
 * @example
 * // Input:
 * // [
 * //   { data: { source: "A", target: "B", weight: 5 } },
 * //   { data: { source: "A", target: "C", weight: 2 } }
 * // ]
 *
 * // Output:
 * // Map {
 * //   "A" => [{ node: "B", weight: 5 }, { node: "C", weight: 2 }],
 * //   "B" => [{ node: "A", weight: 5 }],
 * //   "C" => [{ node: "A", weight: 2 }]
 * // }
 */

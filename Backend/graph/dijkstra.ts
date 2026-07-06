export function dijkstra(
  graph: Map<string, { node: string; weight: number }[]>,
  start: string,
  end: string
) {
  const distances = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();

  const nodes = Array.from(graph.keys());

  for (const n of nodes) {
    distances.set(n, Infinity);
    prev.set(n, null);
  }

  distances.set(start, 0);

  while (nodes.length) {
    nodes.sort((a, b) => (distances.get(a)! - distances.get(b)!));

    const current = nodes.shift()!;
    if (current === end) break;

    if (visited.has(current)) continue;
    visited.add(current);

    const neighbors = graph.get(current) || [];

    for (const { node, weight } of neighbors) {
      const alt = distances.get(current)! + weight;

      if (alt < distances.get(node)!) {
        distances.set(node, alt);
        prev.set(node, current);
      }
    }
  }

  // reconstruct path
  const path: string[] = [];
  let curr: string | null = end;

  while (curr) {
    path.unshift(curr);
    curr = prev.get(curr)!;
  }

  return path[0] === start ? path : [];
}

/**
 * Finds the shortest path between two nodes in a weighted graph using
 * Dijkstra's algorithm.
 *
 * The algorithm computes the minimum cumulative edge weight required to
 * travel from the start node to the end node. It maintains the shortest
 * known distance to each node, tracks predecessors for path
 * reconstruction, and returns the resulting path if one exists.
 *
 * This implementation uses a sorted array as its priority queue, making
 * it suitable for small to medium-sized graphs. For larger graphs, a
 * binary heap or priority queue would provide better performance.
 *
 * @param graph - Adjacency list representation of a weighted graph.
 * @param start - The starting node.
 * @param end - The destination node.
 * @returns An array of node IDs representing the shortest path from
 * `start` to `end`. Returns an empty array if no path exists.
 *
 * @example
 * const path = dijkstra(graph, "dog", "animal");
 * // ["dog", "mammal", "animal"]
 */

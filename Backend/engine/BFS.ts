import { Graph } from "./Graph";

import type { PathResult } from "../models/PathResult";
/**
 * Breadth-first search. Returns the path with the fewest hops from
 * `start` to `end`, ignoring edge weights.
 */
export function bfs(graph: Graph, start: string, end: string): PathResult {
  if (start === end) {
    return { path: [start], distance: 0 };
  }

  const visited = new Set<string>();
  const previous = new Map<string, string | null>();

  const queue: string[] = [start];
  visited.add(start);
  previous.set(start, null);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current === end) break;

    for (const edge of graph.getNeighbors(current)) {
      if (visited.has(edge.target)) continue;

      visited.add(edge.target);
      previous.set(edge.target, current);
      queue.push(edge.target);
    }
  }

  if (!visited.has(end)) {
    return { path: [], distance: Infinity };
  }

  const path: string[] = [];
  let node: string | null = end;
  while (node !== null) {
    path.unshift(node);
    node = previous.get(node) ?? null;
  }

  return { path, distance: path.length - 1 };
}

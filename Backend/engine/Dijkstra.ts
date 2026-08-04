import { Graph } from "./Graph";
import { PriorityQueue } from "./PriorityQueue";

export interface PathResult {
  path: string[];
  distance: number;
}

export function dijkstra(
  graph: Graph,
  start: string,
  end: string
): PathResult {

  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();

  const queue = new PriorityQueue();

  for (const node of graph.getNodes()) {
    distances.set(node.id, Infinity);
    previous.set(node.id, null);
  }

  distances.set(start, 0);

  queue.enqueue(start, 0);

  while (queue.size > 0) {
    const current = queue.dequeue()!;

    const currentNode = current.value;

    if (currentNode === end) {
      break;
    }

    for (const edge of graph.getNeighbors(currentNode)) {

      const newDistance =
        distances.get(currentNode)! + edge.weight;

      if (
        newDistance <
        distances.get(edge.target)!
      ) {
        distances.set(
          edge.target,
          newDistance
        );

        previous.set(
          edge.target,
          currentNode
        );

        queue.enqueue(
          edge.target,
          newDistance
        );
      }
    }
  }


  const path: string[] = [];

  let current: string | null = end;

  while (current) {
    path.unshift(current);
    current = previous.get(current) ?? null;
  }

  if (path[0] !== start) {
    return {
      path: [],
      distance: Infinity
    };
  }

  return {
    path,
    distance: distances.get(end)!
  };
}

/*
 * -----------------------------------------------------------------------------
 * Dijkstra's Shortest Path Algorithm
 * -----------------------------------------------------------------------------
 * This function computes the shortest path between two nodes in a weighted
 * graph using Dijkstra's algorithm.
 *
 * How it works:
 * - Initializes all node distances to Infinity except the start node (0).
 * - Uses a priority queue to always process the node with the smallest
 *   known distance.
 * - Relaxes outgoing edges by updating shorter distances and recording the
 *   previous node for path reconstruction.
 * - Stops early when the destination node is removed from the priority queue.
 * - Reconstructs the shortest path by following the recorded predecessors
 *   from the destination back to the start.
 *
 * Returns:
 * - path: An ordered array of node IDs representing the shortest path.
 * - distance: The total weight of the shortest path.
 *
 * Edge Cases:
 * - If no path exists, an empty path is returned and the distance is Infinity.
 * - Assumes all edge weights are non-negative, as required by Dijkstra's
 *   algorithm.
 *
 * Time Complexity:
 * - O((V + E) log V) when using a priority queue.
 *
 * Space Complexity:
 * - O(V) for the distance map, predecessor map, priority queue, and path.
 *
 * Dependencies:
 * - Graph: Provides nodes and neighboring edges.
 * - PriorityQueue: Efficiently selects the next node with the smallest
 *   tentative distance.
 * -----------------------------------------------------------------------------
 */

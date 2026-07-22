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
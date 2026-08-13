import { GraphResult } from "../models/GraphResult";
import { relationWeight } from "./weights";


export class AdjacencyBuilder {

  static build(result: GraphResult) {

    const graph =
      new Map<string, {
        node:string;
        weight:number;
      }[]>();


    for (const node of result.nodes) {
      graph.set(node.id, []);
    }


    for (const edge of result.edges) {

      graph
        .get(edge.source)!
        .push({
          node: edge.target,
          weight: edge.weight
        });

    }


    return graph;
  }
}

/*
 * Builds an adjacency map from a GraphResult, where each node ID maps to
 * a list of connected nodes and the weight of each connection.
 *
 * Initializes an empty adjacency list for every node, then adds each graph
 * edge as a connection from its source node to its target node.
 */

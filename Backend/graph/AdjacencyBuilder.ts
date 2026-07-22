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
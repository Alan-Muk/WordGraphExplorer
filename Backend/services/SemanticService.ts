import { WordNetService } from "./WordNetService";
import { GraphBuilder } from "../graph/builder";
import { dijkstra } from "../engine/Dijkstra";

export class SemanticService {
  constructor(private wordnet = new WordNetService()) {}

  async path(from: string, to: string) {
    const graphData = await this.wordnet.expand(from, 3);

    const graph = GraphBuilder.build(graphData);

    return dijkstra(graph, from, to);
  }
}

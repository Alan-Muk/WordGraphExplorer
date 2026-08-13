import { WordNetService } from "./WordNetService";
import { GraphBuilder } from "../engine/GraphBuilder";
import { Graph } from "../engine/Graph";
import { dijkstra } from "../engine/Dijkstra";

export class SemanticGraphService {
  private wordnet: WordNetService;
  private builder: GraphBuilder;

  constructor() {
    this.wordnet = new WordNetService();
    this.builder = new GraphBuilder();
  }

  async build(word: string, depth = 2): Promise<Graph> {
    const synsets = await this.wordnet.expand(word, depth);

    if (synsets.length === 0) {
      throw new Error("Word not found");
    }

    return this.builder.build(synsets);
  }

  async path(start: string, end: string, depth = 3) {
    const graph = await this.build(start, depth);

    const startNode = graph
      .getNodes()
      .find((node) => node.label.toLowerCase().includes(start.toLowerCase()));

    const endNode = graph
      .getNodes()
      .find((node) => node.label.toLowerCase().includes(end.toLowerCase()));

    if (!startNode || !endNode) {
      return {
        start,
        end,
        path: [],
        distance: Infinity,
      };
    }

    const result = dijkstra(graph, startNode.id, endNode.id);

    return {
      start,

      end,

      distance: result.distance,

      path: result.path.map((id) => {
        const node = graph.getNode(id);

        return {
          id,

          label: node?.label,

          definition: node?.definition,
        };
      }),
    };
  }
}

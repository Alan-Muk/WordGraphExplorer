import { WordNetService } from "./WordNetService";
import { GraphBuilder } from "../engine/GraphBuilder";
import { Graph } from "../engine/Graph";
import { dijkstra } from "../engine/Dijkstra";
import { findNodeByLabel } from "../util/findNodeByLabel";
import { NotFoundError } from "../util/errors";

export interface PathNode {
  id: string;
  label?: string;
  definition?: string;
}

export interface PathResult {
  start: string;
  end: string;
  distance: number | null;
  path: PathNode[];
}

export class SemanticGraphService {
  private wordnet: WordNetService;
  private builder: GraphBuilder;

  constructor() {
    this.wordnet = new WordNetService();
    this.builder = new GraphBuilder();
  }

  async build(word: string, depth = 5): Promise<Graph> {
    const synsets = await this.wordnet.expand(word, depth);

    if (synsets.length === 0) {
      throw new NotFoundError(`No WordNet entry for "${word}"`);
    }

    return this.builder.build(synsets);
  }

  async path(start: string, end: string, depth = 5): Promise<PathResult> {
    const graph = await this.build(start, depth);

    const startNode = findNodeByLabel(graph, start);
    const endNode = findNodeByLabel(graph, end);

    if (!startNode || !endNode) {
      return { start, end, distance: null, path: [] };
    }

    const result = dijkstra(graph, startNode.id, endNode.id);

    if (result.distance === Infinity || result.path.length === 0) {
      return { start, end, distance: null, path: [] };
    }

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

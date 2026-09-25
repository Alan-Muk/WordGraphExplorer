import { SemanticGraphService, PathNode } from "./SemanticGraphService";
import { dijkstra } from "../engine/Dijkstra";
import { findNodeByLabel } from "../util/findNodeByLabel";
import { DEFAULT_DEPTH } from "../config";

export interface SimilarityResult {
  from: string;
  to: string;
  distance: number | null;
  similarity: number;
  path: PathNode[];
}

export class SimilarityService {
  private graphService: SemanticGraphService;

  constructor() {
    this.graphService = new SemanticGraphService();
  }

  async compare(
    from: string,
    to: string,
    depth = DEFAULT_DEPTH,
  ): Promise<SimilarityResult> {
    const graph = await this.graphService.build(from, depth);

    const start = findNodeByLabel(graph, from);
    const end = findNodeByLabel(graph, to);

    if (!start || !end) {
      return { from, to, distance: null, similarity: 0, path: [] };
    }

    const result = dijkstra(graph, start.id, end.id);

    if (result.distance === Infinity || result.path.length === 0) {
      return { from, to, distance: null, similarity: 0, path: [] };
    }

    return {
      from,
      to,
      distance: result.distance,
      similarity: 1 / (1 + result.distance),
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

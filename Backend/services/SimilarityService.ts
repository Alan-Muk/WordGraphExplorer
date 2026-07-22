import { SemanticGraphService } from "./SemanticGraphService";
import { dijkstra } from "../engine/Dijkstra";


export interface SimilarityResult {

  from: string;

  to: string;

  distance: number;

  similarity: number;

  path: string[];

}


export class SimilarityService {

  private graphService: SemanticGraphService;


  constructor() {

    this.graphService =
      new SemanticGraphService();

  }


  async compare(
    from: string,
    to: string,
    depth = 3
  ): Promise<SimilarityResult> {


    const graph =
      await this.graphService.build(
        from,
        depth
      );


    const start =
      graph.getNodes()
        .find(
          node =>
                    node.label
          .toLowerCase()
          .includes(
            from.toLowerCase()
          )
        );


    const end =
      graph.getNodes()
        .find(
          node =>
            node.label
              .toLowerCase()
              .includes(
                to.toLowerCase()
              )
        );


    if (!start || !end) {

      return {

        from,

        to,

        distance: Infinity,

        similarity: 0,

        path: []

      };

    }


    const result =
      dijkstra(
        graph,
        start.id,
        end.id
      );


    const similarity =
      result.distance === Infinity
        ? 0
        : 1 / (1 + result.distance);



    return {

      from,

      to,

      distance:
        result.distance,

      similarity,

      path:
        result.path

    };

  }

}
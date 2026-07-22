import { describe, expect, test } from "vitest";
import { WordNetService } from "../services/WordNetService";
import { GraphBuilder } from "../engine/GraphBuilder";


describe("Graph integrity", () => {

  test("every edge points to existing nodes", async () => {

    const wordnet =
      new WordNetService();

    const synsets =
      await wordnet.expand(
        "dog",
        2
      );


    const graph =
      new GraphBuilder()
        .build(synsets);


    const nodes =
      new Set(
        graph.getNodes()
          .map(n => n.id)
      );


    for (const edge of graph.getEdges()) {

      expect(nodes.has(edge.source))
        .toBe(true);

      expect(nodes.has(edge.target))
        .toBe(true);

    }

  });

});
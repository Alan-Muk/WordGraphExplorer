import { describe, expect, test } from "vitest";
import { GraphBuilder } from "../engine/GraphBuilder";


describe("GraphBuilder", () => {

  test("converts synsets into graph", () => {

    const builder = new GraphBuilder();


    const graph = builder.build([
      {
        id: "dog.n.01",
        word: "dog",
        definition: "animal",

        relations: [
          {
            type: "hypernym",

            target: {
              id: "animal.n.01",
              word: "animal",
              definition: "living thing"
            }
          }
        ]
      }
    ]);


    expect(graph.getNode("dog.n.01"))
      .toBeDefined();


    expect(
      graph.getNeighbors("dog.n.01")[0]?.target
    )
      .toBe("animal.n.01");

  });

});
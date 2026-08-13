import { describe, expect, test } from "vitest";
import { Graph } from "../engine/Graph";
import { dijkstra } from "../engine/Dijkstra";

describe("Dijkstra", () => {
  test("finds shortest weighted path", () => {
    const graph = new Graph();

    for (const node of ["dog", "canine", "mammal", "animal"]) {
      graph.addNode({
        id: node,
        label: node,
      });
    }

    graph.addEdge({
      source: "dog",
      target: "canine",
      relation: "hypernym",
      weight: 2,
    });

    graph.addEdge({
      source: "canine",
      target: "mammal",
      relation: "hypernym",
      weight: 2,
    });

    graph.addEdge({
      source: "dog",
      target: "animal",
      relation: "related",
      weight: 10,
    });

    const result = dijkstra(graph, "dog", "mammal");

    expect(result.path).toEqual(["dog", "canine", "mammal"]);

    expect(result.distance).toBe(4);
  });
});

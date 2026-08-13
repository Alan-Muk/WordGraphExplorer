import { describe, expect, test } from "vitest";
import { Graph } from "../engine/Graph";

describe("Graph", () => {
  test("adds nodes and edges", () => {
    const graph = new Graph();

    graph.addNode({
      id: "dog",
      label: "dog",
    });

    graph.addNode({
      id: "animal",
      label: "animal",
    });

    graph.addEdge({
      source: "dog",
      target: "animal",
      relation: "hypernym",
      weight: 2,
    });

    expect(graph.getNode("dog")).toBeDefined();

    const neighbors = graph.getNeighbors("dog");

    expect(neighbors).toHaveLength(1);
    expect(neighbors[0]?.target).toBe("animal");
    expect(neighbors[0]?.weight).toBe(2);
  });
});

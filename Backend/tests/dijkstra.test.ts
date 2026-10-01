import { describe, expect, test } from "vitest";
import { Graph } from "../engine/Graph";
import { dijkstra } from "../engine/Dijkstra";
import { relationWeight } from "../graph/weights";

describe("Dijkstra", () => {
  /**
   * Builds a small weighted graph with a known shape:
   *
   *   dog ── canine ── mammal
   *   dog ── animal
   *
   * Where dog–canine and canine–mammal are "hypernym" (base weight 1),
   * and dog–animal is a more expensive "antonym" (base weight 3).
   *
   * The expected shortest path from dog to mammal goes through canine
   * (two hypernym hops), not through animal (which doesn't connect to
   * mammal) — unless the test graph is modified to add that edge.
   */
  function buildGraph(): Graph {
    const g = new Graph();

    for (const id of ["dog", "canine", "mammal", "animal"]) {
      g.addNode({ id, label: id });
    }

    g.addEdge({
      source: "dog",
      target: "canine",
      label: "hypernym",
      weight: relationWeight("hypernym"),
    });
    g.addEdge({
      source: "canine",
      target: "mammal",
      label: "hypernym",
      weight: relationWeight("hypernym"),
    });
    g.addEdge({
      source: "dog",
      target: "animal",
      label: "antonym",
      weight: relationWeight("antonym"),
    });

    return g;
  }

  test("finds a path between connected nodes", () => {
    const graph = buildGraph();
    const result = dijkstra(graph, "dog", "mammal");

    expect(result.path).toEqual(["dog", "canine", "mammal"]);
    expect(result.distance).toBeGreaterThan(0);
    expect(Number.isFinite(result.distance)).toBe(true);
  });

  test("returns distance that is the sum of the path's edge weights", () => {
    const graph = buildGraph();
    const result = dijkstra(graph, "dog", "mammal");

    // Recompute the total weight along the returned path, using the
    // same graph.edgeWeight() the algorithm uses.
    let expected = 0;
    for (let i = 0; i < result.path.length - 1; i++) {
      const from = result.path[i];
      const to = result.path[i + 1];
      const edge = graph.getNeighbors(from).find((e) => e.target === to);
      expect(edge).toBeDefined();
      expected += graph.edgeWeight(edge!);
    }

    expect(result.distance).toBeCloseTo(expected, 6);
  });

  test("prefers the cheaper of two routes", () => {
    // Build a graph with two routes from A to D:
    //   A → B → D  (two cheap edges)
    //   A → C → D  (two expensive edges)
    const g = new Graph();

    for (const id of ["A", "B", "C", "D"]) {
      g.addNode({ id, label: id });
    }

    g.addEdge({
      source: "A",
      target: "B",
      label: "hypernym",
      weight: relationWeight("hypernym"),
    });
    g.addEdge({
      source: "B",
      target: "D",
      label: "hypernym",
      weight: relationWeight("hypernym"),
    });
    g.addEdge({
      source: "A",
      target: "C",
      label: "antonym",
      weight: relationWeight("antonym"),
    });
    g.addEdge({
      source: "C",
      target: "D",
      label: "antonym",
      weight: relationWeight("antonym"),
    });

    const result = dijkstra(g, "A", "D");

    // Should take the cheap route through B.
    expect(result.path).toEqual(["A", "B", "D"]);
  });

  test("returns no path when the target is unreachable", () => {
    const g = new Graph();
    for (const id of ["A", "B", "C"]) {
      g.addNode({ id, label: id });
    }
    g.addEdge({
      source: "A",
      target: "B",
      label: "hypernym",
      weight: relationWeight("hypernym"),
    });
    // C is isolated.

    const result = dijkstra(g, "A", "C");
    expect(result.path).toEqual([]);
    expect(result.distance).toBe(Infinity);
  });

  test("returns a single-node path when start equals end", () => {
    const graph = buildGraph();
    const result = dijkstra(graph, "dog", "dog");

    expect(result.path).toEqual(["dog"]);
    expect(result.distance).toBe(0);
  });
});

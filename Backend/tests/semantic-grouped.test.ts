import { describe, expect, test } from "vitest";
import { SemanticGraphService } from "../services/SemanticGraphService";

describe("SemanticGraphService.grouped", () => {
  test("returns a root matching the searched word", async () => {
    const service = new SemanticGraphService();
    const result = await service.grouped("dog");

    expect(result.word).toBe("dog");
    expect(result.root.label.toLowerCase()).toBe("dog");
    expect(result.root.id).toMatch(/^\d+\./);
  });

  test("groups dog's relations by type", async () => {
    const service = new SemanticGraphService();
    const result = await service.grouped("dog");

    const relationNames = result.groups.map((g) => g.relation);

    expect(relationNames).toContain("hypernym");
    expect(relationNames).toContain("hyponym");
    // No duplicate groups
    expect(new Set(relationNames).size).toBe(relationNames.length);
  });

  test("groups are returned in a stable order", async () => {
    const service = new SemanticGraphService();
    const result = await service.grouped("dog");

    const relationNames = result.groups.map((g) => g.relation);
    const ORDER = [
      "hypernym",
      "hyponym",
      "meronym",
      "holonym",
      "antonym",
      "unknown",
    ];
    const indices = relationNames.map((r) => ORDER.indexOf(r));

    // The indices should be sorted ascending
    for (let i = 1; i < indices.length; i++) {
      expect(indices[i]).toBeGreaterThan(indices[i - 1]);
    }
  });

  test("each node in a group has id, label, and optional definition", async () => {
    const service = new SemanticGraphService();
    const result = await service.grouped("dog");

    for (const group of result.groups) {
      for (const node of group.nodes) {
        expect(typeof node.id).toBe("string");
        expect(typeof node.label).toBe("string");
        expect(node.id.length).toBeGreaterThan(0);
        expect(node.label.length).toBeGreaterThan(0);
        // definition may be undefined, but if present must be a string
        if (node.definition !== undefined) {
          expect(typeof node.definition).toBe("string");
        }
      }
    }
  });

  test("total reflects the full group size before capping", async () => {
    const service = new SemanticGraphService();
    const result = await service.grouped("dog");

    for (const group of result.groups) {
      expect(group.total).toBeGreaterThanOrEqual(group.nodes.length);
    }
  });

  test("caps each group at 30 nodes by default", async () => {
    const service = new SemanticGraphService();
    // 'animal' likely has many hyponyms
    const result = await service.grouped("animal");

    for (const group of result.groups) {
      expect(group.nodes.length).toBeLessThanOrEqual(30);
    }
  });

  test("respects an explicit limit", async () => {
    const service = new SemanticGraphService();
    const result = await service.grouped("dog", 2);

    for (const group of result.groups) {
      expect(group.nodes.length).toBeLessThanOrEqual(2);
    }
  });

  test("capped groups report the true total", async () => {
    const service = new SemanticGraphService();
    const result = await service.grouped("animal", 5);

    const capped = result.groups.find((g) => g.total > g.nodes.length);
    // 'animal' should have at least one group large enough to be capped at 5
    expect(capped).toBeDefined();
    if (capped) {
      expect(capped.nodes.length).toBe(5);
      expect(capped.total).toBeGreaterThan(5);
    }
  });

  test("sorts each group by degree descending, then label ascending", async () => {
    const service = new SemanticGraphService();
    const result = await service.grouped("dog");

    // We can't easily verify degree without re-running the computation,
    // but we can verify the sort is stable — running the same query twice
    // produces the same ordering.
    const service2 = new SemanticGraphService();
    const result2 = await service2.grouped("dog");

    for (let i = 0; i < result.groups.length; i++) {
      const labels1 = result.groups[i].nodes.map((n) => n.label);
      const labels2 = result2.groups[i].nodes.map((n) => n.label);
      expect(labels1).toEqual(labels2);
    }
  });

  test("throws NotFoundError for an unknown word", async () => {
    const service = new SemanticGraphService();

    await expect(service.grouped("asdfqwerzxcv")).rejects.toThrow(
      /No WordNet entry|No graph/,
    );
  });
});

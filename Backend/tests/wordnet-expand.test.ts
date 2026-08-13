import { describe, expect, test } from "vitest";

import { WordNetService } from "../services/WordNetService";

describe("WordNet expansion", () => {
  test("expands dog hierarchy", async () => {
    const service = new WordNetService();

    const synsets = await service.expand("dog", 2);

    expect(synsets.length).toBeGreaterThan(1);

    const dog = synsets.find(
      (s) =>
        s.word?.toLowerCase() === "dog" ||
        s.word?.toLowerCase().includes("dog"),
    );

    expect(dog).toBeDefined();

    expect(dog?.relations.length).toBeGreaterThan(0);

    for (const synset of synsets) {
      expect(synset.id).toBeDefined();

      expect(synset.definition).toBeDefined();

      expect(Array.isArray(synset.relations)).toBe(true);
    }
  });
});

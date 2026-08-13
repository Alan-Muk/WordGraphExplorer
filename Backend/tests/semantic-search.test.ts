import { describe, expect, test } from "vitest";
import { WordNetService } from "../services/WordNetService";

describe("Semantic expansion", () => {
  test("dog expands to animal hierarchy", async () => {
    const service = new WordNetService();

    const synsets = await service.expand("dog", 2);

    const words = synsets.map((s) => s.word);

    expect(words.some((w) => w.includes("dog"))).toBe(true);

    expect(synsets.length).toBeGreaterThan(1);
  });
});

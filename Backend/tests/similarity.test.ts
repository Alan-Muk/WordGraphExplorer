import { describe, expect, test } from "vitest";
import { SimilarityService } from "../services/SimilarityService";

describe("SimilarityService", () => {
  test("dog is similar to animal", async () => {
    const service = new SimilarityService();

    const result = await service.compare("dog", "animal");

    expect(result.distance).toBe(1);

    expect(result.similarity).toBeGreaterThan(0);
  });

  test("unknown words return zero similarity", async () => {
    const service = new SimilarityService();

    const result = await service.compare("dog", "xyznotaword");

    expect(result.similarity).toBe(0);
  });
});

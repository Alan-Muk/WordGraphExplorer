import { describe, expect, test } from "vitest";
import { WordNetService } from "../services/WordNetService";

describe("WordNetService", () => {
  test("looks up a word", async () => {
    const service = new WordNetService();

    const results = await service.lookup("dog");

    expect(results.length).toBeGreaterThan(0);

    expect(results[0]?.word).toBe("dog");
  });
});

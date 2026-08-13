import { describe, expect, test } from "vitest";
import { relationWeight } from "../graph/weights";

describe("Relation weights", () => {
  test("strong semantic relations have low cost", () => {
    expect(relationWeight("hypernym")).toBe(1);

    expect(relationWeight("hyponym")).toBe(1);
  });

  test("weaker relations have higher cost", () => {
    expect(relationWeight("meronym")).toBe(2);

    expect(relationWeight("antonym")).toBe(3);
  });

  test("unknown relations get fallback cost", () => {
    expect(relationWeight("something_unknown")).toBe(5);
  });
});

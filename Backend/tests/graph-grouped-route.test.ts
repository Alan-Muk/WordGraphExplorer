import { describe, expect, test, beforeAll, afterAll } from "vitest";
import express from "express";
import graphRoutes from "../routes/graph";

let server: ReturnType<typeof express.application.listen>;
let baseUrl: string;

beforeAll(async () => {
  const app = express();
  app.use("/graph", graphRoutes);
  await new Promise<void>((resolve) => {
    server = app.listen(0, "127.0.0.1", () => resolve());
  });
  const address = server.address();
  if (address && typeof address === "object") {
    baseUrl = `http://127.0.0.1:${address.port}`;
  }
});

afterAll(() => {
  server?.close();
});

describe("GET /graph/:word?view=grouped", () => {
  test("returns grouped graph for a known word", async () => {
    const res = await fetch(`${baseUrl}/graph/dog?view=grouped`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.word).toBe("dog");
    expect(body.root).toBeDefined();
    expect(Array.isArray(body.groups)).toBe(true);
    expect(body.groups.length).toBeGreaterThan(0);
  });

  test("returns 404 for an unknown word", async () => {
    const res = await fetch(`${baseUrl}/graph/asdfqwerzxcv?view=grouped`);
    expect(res.status).toBe(404);

    const body = await res.json();
    expect(body.error).toBeDefined();
  });
});

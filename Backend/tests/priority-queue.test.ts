import { describe, expect, test } from "vitest";
import { PriorityQueue } from "../engine/PriorityQueue";

describe("PriorityQueue", () => {
  test("returns lowest priority first", () => {
    const queue = new PriorityQueue();

    queue.enqueue("animal", 5);
    queue.enqueue("dog", 1);
    queue.enqueue("mammal", 3);

    expect(queue.dequeue()?.value).toBe("dog");

    expect(queue.dequeue()?.value).toBe("mammal");

    expect(queue.dequeue()?.value).toBe("animal");
  });
});

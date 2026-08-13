export interface QueueNode {
  value: string;
  priority: number;
}

export class PriorityQueue {
  private heap: QueueNode[] = [];

  enqueue(value: string, priority: number) {
    this.heap.push({ value, priority });
    this.bubbleUp();
  }

  dequeue(): QueueNode | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }

    const min = this.heap[0];
    const end = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.bubbleDown();
    }

    return min;
  }

  get size() {
    return this.heap.length;
  }

  private bubbleUp() {
    let index = this.heap.length - 1;

    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);

      const currentNode = this.heap[index];
      const parentNode = this.heap[parent];

      if (!currentNode || !parentNode) {
        break;
      }

      if (parentNode.priority <= currentNode.priority) {
        break;
      }

      this.heap[parent] = currentNode;
      this.heap[index] = parentNode;

      index = parent;
    }
  }

  private bubbleDown() {
    let index = 0;

    while (true) {
      let smallest = index;

      const left = index * 2 + 1;
      const right = index * 2 + 2;

      const current = this.heap[index];

      if (!current) {
        break;
      }

      const leftNode = this.heap[left];

      if (leftNode && leftNode.priority < current.priority) {
        smallest = left;
      }

      const smallestNode = this.heap[smallest];
      const rightNode = this.heap[right];

      if (
        rightNode &&
        smallestNode &&
        rightNode.priority < smallestNode.priority
      ) {
        smallest = right;
      }

      if (smallest === index) {
        break;
      }

      const temp = this.heap[index];
      this.heap[index] = this.heap[smallest]!;
      this.heap[smallest] = temp!;

      index = smallest;
    }
  }
}

/*
 * -----------------------------------------------------------------------------
 * PriorityQueue Class
 * -----------------------------------------------------------------------------
 * This class implements a minimum priority queue using a binary min-heap.
 * It efficiently stores elements with associated priorities and always removes
 * the element with the lowest priority value first.
 *
 * Purpose:
 * - Provides fast insertion and removal operations for algorithms that
 *   repeatedly need the smallest-priority element, such as Dijkstra's
 *   shortest path algorithm.
 *
 * Main Operations:
 * - enqueue() : Inserts a new value with its priority into the queue.
 * - dequeue() : Removes and returns the value with the smallest priority.
 * - size      : Returns the current number of elements in the queue.
 *
 * Internal Methods:
 * - bubbleUp()   : Restores the heap property after inserting a new element by
 *                  moving it upward until the correct position is reached.
 * - bubbleDown() : Restores the heap property after removing the root by
 *                  moving the replacement element downward as needed.
 *
 * Data Structure:
 * - Uses an array-based binary min-heap.
 * - Parent index: (i - 1) / 2
 * - Left child:   (2 * i) + 1
 * - Right child:  (2 * i) + 2
 *
 * Complexity:
 * - enqueue() : O(log n)
 * - dequeue() : O(log n)
 * - size      : O(1)
 * - Space     : O(n)
 *
 * Notes:
 * - Lower numeric priority values represent higher priority.
 * - Duplicate priorities are supported.
 * - The queue does not prevent duplicate values; each entry is treated as an
 *   independent element.
 * - This implementation serves as the core data structure for efficient graph
 *   traversal and shortest-path algorithms.
 * -----------------------------------------------------------------------------
 */

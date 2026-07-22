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

    if (
      leftNode &&
      leftNode.priority < current.priority
    ) {
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
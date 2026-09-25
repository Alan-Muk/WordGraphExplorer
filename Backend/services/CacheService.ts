// services/CacheService.ts

export class CacheService<T> {
  private store = new Map<string, Promise<T>>();
  private readonly maxSize: number;

  constructor(maxSize = 500) {
    this.maxSize = maxSize;
  }

  /**
   * Returns the cached value if present; otherwise calls `loader` and
   * caches its promise. Concurrent callers for the same key share one
   * in-flight promise.
   */
  async get(key: string, loader: () => Promise<T>): Promise<T> {
    const existing = this.store.get(key);
    if (existing) {
      return existing;
    }

    const promise = loader();

    // Evict oldest entry if over capacity.
    if (this.store.size >= this.maxSize) {
      const oldest = this.store.keys().next().value;
      if (oldest !== undefined) {
        this.store.delete(oldest);
      }
    }

    this.store.set(key, promise);

    // If the loader fails, drop the cache entry so the next call retries.
    promise.catch(() => {
      this.store.delete(key);
    });

    return promise;
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}

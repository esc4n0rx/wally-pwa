interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class InMemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 1000;

  set<T>(key: string, data: T, ttlMs: number = 300000): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (typeof firstKey === "string") {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
}

export const apiCache = new InMemoryCache();
import NodeCache from 'node-cache';

// StdTTL: 1 hour (3600 seconds), check period: 10 minutes (600 seconds)
export const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

export class CacheService {
  /**
   * Get an item from the cache or fetch it if it doesn't exist
   */
  static async getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttlSeconds?: number): Promise<T> {
    const cachedData = cache.get<T>(key);
    
    if (cachedData !== undefined) {
      
      return cachedData;
    }

    
    const freshData = await fetchFn();
    
    if (ttlSeconds) {
      cache.set(key, freshData, ttlSeconds);
    } else {
      cache.set(key, freshData);
    }
    
    return freshData;
  }

  static invalidate(key: string): void {
    cache.del(key);
    
  }
}

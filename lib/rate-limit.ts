import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasRedis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: any;
let ratelimit: any;
let downloadRateLimit: any;

if (hasRedis) {
  redis = Redis.fromEnv();
  
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 h"),
    analytics: true,
    prefix: "wally",
  });

  downloadRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "wally:download",
  });
} else {
  console.warn('⚠️ Redis não configurado, usando rate limiting em memória (apenas desenvolvimento)');
  
  const inMemoryStore = new Map<string, { count: number; resetTime: number }>();
  
  const createMemoryRateLimit = (maxRequests: number, windowMs: number) => ({
    limit: async (key: string) => {
      const now = Date.now();
      const record = inMemoryStore.get(key);
      
      if (!record || now > record.resetTime) {
        inMemoryStore.set(key, { count: 1, resetTime: now + windowMs });
        return { 
          success: true, 
          limit: maxRequests, 
          remaining: maxRequests - 1, 
          reset: now + windowMs 
        };
      }
      
      if (record.count >= maxRequests) {
        return { 
          success: false, 
          limit: maxRequests, 
          remaining: 0, 
          reset: record.resetTime 
        };
      }
      
      record.count++;
      return { 
        success: true, 
        limit: maxRequests, 
        remaining: maxRequests - record.count, 
        reset: record.resetTime 
      };
    }
  });
  
  ratelimit = createMemoryRateLimit(100, 60 * 60 * 1000); 
  downloadRateLimit = createMemoryRateLimit(10, 60 * 1000);
}

export { ratelimit, downloadRateLimit };
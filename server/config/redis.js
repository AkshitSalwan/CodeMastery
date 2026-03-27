import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;
let redis = null;
let redisAvailable = false;
let warnedUnavailable = false;

const logUnavailable = (message) => {
  if (!warnedUnavailable) {
    console.warn(`Redis unavailable, continuing without cache: ${message}`);
    warnedUnavailable = true;
  }
};

if (redisUrl) {
  redis = new Redis(redisUrl, {
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null,
    reconnectOnError: () => false,
  });

  redis.on('connect', () => {
    redisAvailable = true;
    warnedUnavailable = false;
    console.log('Redis connected successfully.');
  });

  redis.on('error', (err) => {
    redisAvailable = false;
    logUnavailable(err.message || 'connection error');
  });
} else {
  logUnavailable('REDIS_URL is not configured');
}

const withRedis = async (operation, fallback) => {
  if (!redis) {
    return fallback;
  }

  try {
    if (!redisAvailable) {
      await redis.connect();
    }

    redisAvailable = true;
    return await operation();
  } catch (error) {
    redisAvailable = false;
    logUnavailable(error.message || 'operation failed');
    return fallback;
  }
};

const cacheService = {
  async set(key, value, expiry = 3600) {
    return withRedis(async () => {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
      await redis.setex(key, expiry, stringValue);
      return true;
    }, false);
  },

  async get(key) {
    return withRedis(async () => {
      const value = await redis.get(key);
      if (!value) {
        return null;
      }

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }, null);
  },

  async del(key) {
    return withRedis(async () => {
      await redis.del(key);
      return true;
    }, false);
  },

  async delPattern(pattern) {
    return withRedis(async () => {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    }, false);
  },

  async addToLeaderboard(leaderboardKey, memberId, score) {
    return withRedis(async () => {
      await redis.zadd(leaderboardKey, score, memberId);
      return true;
    }, false);
  },

  async getLeaderboard(leaderboardKey, start = 0, end = -1) {
    return withRedis(async () => redis.zrevrange(leaderboardKey, start, end, 'WITHSCORES'), []);
  },

  async getRank(leaderboardKey, memberId) {
    return withRedis(async () => {
      const rank = await redis.zrevrank(leaderboardKey, memberId);
      return rank !== null ? rank + 1 : null;
    }, null);
  },

  async getScore(leaderboardKey, memberId) {
    return withRedis(async () => {
      const score = await redis.zscore(leaderboardKey, memberId);
      return score ? parseFloat(score) : null;
    }, null);
  },

  async setSession(sessionId, data, expiry = 86400) {
    return this.set(`session:${sessionId}`, data, expiry);
  },

  async getSession(sessionId) {
    return this.get(`session:${sessionId}`);
  },

  async deleteSession(sessionId) {
    return this.del(`session:${sessionId}`);
  }
};

export { redis, cacheService };
export default redis;

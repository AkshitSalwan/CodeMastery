import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true
});

redis.on('connect', () => {
  console.log('✅ Redis connected successfully.');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});

// Cache utility functions
const cacheService = {
  // Set cache with expiry (default 1 hour)
  async set(key, value, expiry = 3600) {
    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
      await redis.setex(key, expiry, stringValue);
      return true;
    } catch (error) {
      console.error('Cache set error:', error.message);
      return false;
    }
  },

  // Get cached value
  async get(key) {
    try {
      const value = await redis.get(key);
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Cache get error:', error.message);
      return null;
    }
  },

  // Delete cache
  async del(key) {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error.message);
      return false;
    }
  },

  // Delete pattern
  async delPattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Cache delete pattern error:', error.message);
      return false;
    }
  },

  // Leaderboard operations
  async addToLeaderboard(leaderboardKey, memberId, score) {
    try {
      await redis.zadd(leaderboardKey, score, memberId);
      return true;
    } catch (error) {
      console.error('Leaderboard add error:', error.message);
      return false;
    }
  },

  async getLeaderboard(leaderboardKey, start = 0, end = -1) {
    try {
      const results = await redis.zrevrange(leaderboardKey, start, end, 'WITHSCORES');
      return results;
    } catch (error) {
      console.error('Leaderboard get error:', error.message);
      return [];
    }
  },

  async getRank(leaderboardKey, memberId) {
    try {
      const rank = await redis.zrevrank(leaderboardKey, memberId);
      return rank !== null ? rank + 1 : null;
    } catch (error) {
      console.error('Rank get error:', error.message);
      return null;
    }
  },

  async getScore(leaderboardKey, memberId) {
    try {
      const score = await redis.zscore(leaderboardKey, memberId);
      return score ? parseFloat(score) : null;
    } catch (error) {
      console.error('Score get error:', error.message);
      return null;
    }
  },

  // Session storage
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

require('dotenv').config();

let Redis;

try {
  Redis = require('ioredis');
} catch (error) {
  Redis = null;
}

const REDIS_URL = process.env.REDIS_URL;
const DEFAULT_TTL_SECONDS = Number(process.env.LEARNERS_PLATFORM_YOUTUBE_CACHE_TTL || 21600);

let redisClient = null;
let redisReady = false;
let redisDisabledReason = null;

if (!Redis) {
  redisDisabledReason = 'ioredis is not installed';
} else if (!REDIS_URL) {
  redisDisabledReason = 'REDIS_URL is not configured';
} else {
  redisClient = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    enableReadyCheck: true,
    enableOfflineQueue: false,
    connectTimeout: 1500,
    retryStrategy: () => null,
  });

  redisClient.on('ready', () => {
    redisReady = true;
  });

  redisClient.on('close', () => {
    redisReady = false;
  });

  redisClient.on('error', (error) => {
    redisReady = false;
    redisDisabledReason = error.message || 'Redis connection error';
  });
}

const connectRedisIfNeeded = async () => {
  if (!redisClient || redisReady) {
    return redisReady;
  }

  try {
    await redisClient.connect();
    redisReady = true;
    redisDisabledReason = null;
    return true;
  } catch (error) {
    redisReady = false;
    redisDisabledReason = error.message || 'Redis connection failed';
    return false;
  }
};

const getCache = async (key) => {
  if (!(await connectRedisIfNeeded())) {
    return null;
  }

  try {
    const value = await redisClient.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    redisDisabledReason = error.message || 'Redis get failed';
    return null;
  }
};

const setCache = async (key, value, ttlSeconds = DEFAULT_TTL_SECONDS) => {
  if (!(await connectRedisIfNeeded())) {
    return false;
  }

  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    return true;
  } catch (error) {
    redisDisabledReason = error.message || 'Redis set failed';
    return false;
  }
};

const getRedisCacheStatus = () => ({
  enabled: Boolean(redisClient),
  ready: redisReady,
  reason: redisDisabledReason,
  defaultTtlSeconds: DEFAULT_TTL_SECONDS,
});

module.exports = {
  DEFAULT_TTL_SECONDS,
  getCache,
  getRedisCacheStatus,
  setCache,
};

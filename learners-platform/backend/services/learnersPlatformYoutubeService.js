import { DEFAULT_TTL_SECONDS, getCache, setCache } from '../../../server/utils/redisCache.js';

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

const difficultyQueryMap = {
  beginner: 'for beginners introduction tutorial',
  intermediate: 'intermediate tutorial project walkthrough',
  advanced: 'advanced deep dive masterclass'
};

const normalizeCacheSegment = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const buildTopicVideosCacheKey = (topic, difficulty) =>
  `learners-platform:youtube:${normalizeCacheSegment(topic)}:${normalizeCacheSegment(difficulty)}`;

const mapVideo = (item) => ({
  id: item.id.videoId,
  title: item.snippet.title,
  description: item.snippet.description,
  channelTitle: item.snippet.channelTitle,
  publishedAt: item.snippet.publishedAt,
  thumbnail:
    item.snippet.thumbnails?.high?.url ||
    item.snippet.thumbnails?.medium?.url ||
    item.snippet.thumbnails?.default?.url,
  watchUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
});

const searchTopicVideos = async (topic, difficulty = 'beginner') => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const fetchFn = globalThis.fetch;
  const normalizedDifficulty = String(difficulty || 'beginner').toLowerCase();
  const cacheKey = buildTopicVideosCacheKey(topic, normalizedDifficulty);

  if (!apiKey) {
    return {
      configured: false,
      videos: [],
      message: 'YOUTUBE_API_KEY is not configured',
      cached: false,
      cacheKey,
      fetchedAt: null,
      videoCount: 0,
    };
  }

  if (!fetchFn) {
    return {
      configured: true,
      videos: [],
      message: 'Global fetch is not available in this Node runtime',
      cached: false,
      cacheKey,
      fetchedAt: null,
      videoCount: 0,
    };
  }

  const cachedResult = await getCache(cacheKey);
  if (cachedResult) {
    return {
      ...cachedResult,
      cacheKey,
      cached: true,
      configured: true,
    };
  }

  const difficultyTerms = difficultyQueryMap[normalizedDifficulty] || difficultyQueryMap.beginner;
  const query = `${topic} ${difficultyTerms} programming`;

  const url = new URL(YOUTUBE_API_URL);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', '6');
  url.searchParams.set('order', 'relevance');
  url.searchParams.set('videoEmbeddable', 'true');
  url.searchParams.set('relevanceLanguage', 'en');
  url.searchParams.set(
    'fields',
    'items(id/videoId,snippet(title,description,channelTitle,publishedAt,thumbnails(default/url,medium/url,high/url)))'
  );

  try {
    const response = await fetchFn(url, {
      signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout
        ? AbortSignal.timeout(10000)
        : undefined,
    });
    const data = await response.json();

    if (!response.ok) {
      return {
        configured: true,
        videos: [],
        message: data?.error?.message || 'Failed to fetch YouTube videos',
        cached: false,
        cacheKey,
        fetchedAt: null,
        videoCount: 0,
      };
    }

    const videos = (data.items || []).map(mapVideo);
    const result = {
      configured: true,
      videos,
      message: null,
      cached: false,
      cacheKey,
      fetchedAt: new Date().toISOString(),
      videoCount: videos.length,
      cacheTtlSeconds: DEFAULT_TTL_SECONDS,
    };

    await setCache(cacheKey, {
      configured: result.configured,
      videos: result.videos,
      message: result.message,
      fetchedAt: result.fetchedAt,
      videoCount: result.videoCount,
      cacheTtlSeconds: result.cacheTtlSeconds,
    });

    return result;
  } catch (error) {
    return {
      configured: true,
      videos: [],
      message: error.message || 'Unexpected YouTube API error',
      cached: false,
      cacheKey,
      fetchedAt: null,
      videoCount: 0,
    };
  }
};

export {
  buildTopicVideosCacheKey,
  searchTopicVideos,
};

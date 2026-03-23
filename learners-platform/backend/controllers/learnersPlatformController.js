const { learningTopics, learnersPlatformMeta } = require('../data/topics');
const { searchTopicVideos } = require('../services/learnersPlatformYoutubeService');
const { getRedisCacheStatus } = require('../../../server/utils/redisCache');
const { generateTopicAssessment } = require('../services/learnersPlatformAssessmentService');

const filterTopics = (topics, query) => {
  const search = String(query.search || '').trim().toLowerCase();
  const level = String(query.level || 'all').trim().toLowerCase();
  const category = String(query.category || 'all').trim().toLowerCase();

  return topics.filter((topic) => {
    const matchesSearch =
      !search ||
      topic.title.toLowerCase().includes(search) ||
      topic.description.toLowerCase().includes(search) ||
      topic.tags.some((tag) => tag.toLowerCase().includes(search));

    const matchesLevel = level === 'all' || topic.level.toLowerCase() === level;
    const matchesCategory = category === 'all' || topic.category.toLowerCase() === category;

    return matchesSearch && matchesLevel && matchesCategory;
  });
};

const getMeta = (req, res) => {
  res.json({
    meta: learnersPlatformMeta,
    filters: {
      levels: ['All', 'Beginner', 'Intermediate', 'Advanced'],
      categories: ['All', ...new Set(learningTopics.map((topic) => topic.category))]
    }
  });
};

const getTopics = (req, res) => {
  const topics = filterTopics(learningTopics, req.query);

  res.json({
    topics,
    total: topics.length
  });
};

const getFeaturedTopics = (req, res) => {
  const featuredTopics = learningTopics.filter((topic) => topic.featured);

  res.json({
    topics: featuredTopics,
    total: featuredTopics.length
  });
};

const getTopicBySlug = (req, res) => {
  const topic = learningTopics.find((entry) => entry.slug === req.params.slug);

  if (!topic) {
    return res.status(404).json({
      message: 'Learning topic not found'
    });
  }

  return res.json({ topic });
};

const getTopicVideos = async (req, res) => {
  const topic = learningTopics.find((entry) => entry.slug === req.params.slug);

  if (!topic) {
    return res.status(404).json({
      message: 'Learning topic not found'
    });
  }

  const result = await searchTopicVideos(topic.title, topic.level.toLowerCase());

  return res.json({
    topic: {
      slug: topic.slug,
      title: topic.title,
      level: topic.level,
      category: topic.category,
    },
    videos: result.videos || [],
    source: 'youtube',
    configured: result.configured,
    message: result.message || null,
    cached: Boolean(result.cached),
    fetchedAt: result.fetchedAt || null,
    videoCount: typeof result.videoCount === 'number' ? result.videoCount : (result.videos || []).length,
    cache: {
      ...getRedisCacheStatus(),
      key: result.cacheKey || null,
      ttlSeconds: result.cacheTtlSeconds || null,
    }
  });
};

const getTopicAssessment = async (req, res) => {
  const topic = learningTopics.find((entry) => entry.slug === req.params.slug);

  if (!topic) {
    return res.status(404).json({
      message: 'Learning topic not found'
    });
  }

  const solvedProblems = Array.isArray(req.body?.solvedProblems) ? req.body.solvedProblems : [];
  const assessment = await generateTopicAssessment(topic, solvedProblems);

  return res.json({
    topic: {
      slug: topic.slug,
      title: topic.title,
      level: topic.level,
      category: topic.category,
    },
    assessment: {
      source: assessment.source,
      generatedAt: assessment.generatedAt,
      cached: Boolean(assessment.cached),
      dueProblemCount: assessment.dueProblemCount,
      focusAreas: assessment.focusAreas || [],
      questions: assessment.questions || [],
      basedOnSolvedProblems: assessment.basedOnSolvedProblems || [],
    },
    cache: {
      ...getRedisCacheStatus(),
      key: assessment.cacheKey || null,
      ttlSeconds: assessment.cacheTtlSeconds || null,
    }
  });
};

module.exports = {
  getMeta,
  getTopics,
  getFeaturedTopics,
  getTopicBySlug,
  getTopicAssessment,
  getTopicVideos,
};

import { Topic, Resource, LearningProgress, Problem } from '../models/index.js';
import { asyncHandler, NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { cacheService } from '../config/redis.js';
import { Op } from 'sequelize';

// Get all topics
export const getAllTopics = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, difficulty, search, status = 'published' } = req.query;
  
  const cacheKey = `topics:${page}:${limit}:${difficulty}:${search}:${status}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }
  
  const whereClause = { status };
  if (difficulty) whereClause.difficulty = difficulty;
  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }
  
  const { count, rows: topics } = await Topic.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    order: [['order', 'ASC'], ['created_at', 'DESC']],
    include: [{
      model: Resource,
      as: 'resources',
      attributes: ['id', 'type', 'title'],
      limit: 3
    }]
  });
  
  const result = {
    topics,
    pagination: {
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit))
    }
  };
  
  await cacheService.set(cacheKey, result, 300); // Cache for 5 minutes
  
  res.json(result);
});

// Get topic by slug
export const getTopicBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.dbUser?.id;
  
  const cacheKey = `topic:${slug}`;
  let topic = await cacheService.get(cacheKey);
  
  if (!topic) {
    topic = await Topic.findOne({
      where: { slug },
      include: [
        {
          model: Resource,
          as: 'resources',
          order: [['order', 'ASC']]
        },
        {
          model: Problem,
          as: 'problems',
          attributes: ['id', 'title', 'slug', 'difficulty', 'points'],
          limit: 10
        }
      ]
    });
    
    if (!topic) {
      throw new NotFoundError('Topic');
    }
    
    await cacheService.set(cacheKey, topic, 300);
  }
  
  // Get user's learning progress if authenticated
  let learningProgress = null;
  if (userId) {
    learningProgress = await LearningProgress.findOne({
      where: { user_id: userId, topic_id: topic.id }
    });
  }
  
  res.json({
    topic,
    learningProgress
  });
});

// Create topic (Admin)
export const createTopic = asyncHandler(async (req, res) => {
  const { name, slug, description, difficulty, estimated_time, roadmap, tags, icon, color, prerequisites } = req.body;
  const userId = req.dbUser.id;
  
  // Check if slug exists
  const existingTopic = await Topic.findOne({ where: { slug } });
  if (existingTopic) {
    throw new ValidationError('Topic with this slug already exists');
  }
  
  const topic = await Topic.create({
    name,
    slug,
    description,
    difficulty,
    estimated_time,
    roadmap,
    tags,
    icon,
    color,
    prerequisites,
    created_by: userId,
    status: 'published'
  });
  
  // Invalidate cache
  await cacheService.delPattern('topics:*');
  
  res.status(201).json({
    message: 'Topic created successfully',
    topic
  });
});

// Update topic (Admin)
export const updateTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const topic = await Topic.findByPk(id);
  if (!topic) {
    throw new NotFoundError('Topic');
  }
  
  await topic.update(updates);
  
  // Invalidate cache
  await cacheService.del(`topic:${topic.slug}`);
  await cacheService.delPattern('topics:*');
  
  res.json({
    message: 'Topic updated successfully',
    topic
  });
});

// Delete topic (Admin)
export const deleteTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const topic = await Topic.findByPk(id);
  if (!topic) {
    throw new NotFoundError('Topic');
  }
  
  await topic.destroy();
  
  // Invalidate cache
  await cacheService.del(`topic:${topic.slug}`);
  await cacheService.delPattern('topics:*');
  
  res.json({ message: 'Topic deleted successfully' });
});

// Get topic resources
export const getTopicResources = asyncHandler(async (req, res) => {
  const { topicId } = req.params;
  const { type, difficulty } = req.query;
  
  const whereClause = { topic_id: topicId };
  if (type) whereClause.type = type;
  if (difficulty) whereClause.difficulty = difficulty;
  
  const resources = await Resource.findAll({
    where: whereClause,
    order: [['order', 'ASC']]
  });
  
  res.json({ resources });
});

// Add resource to topic
export const addResource = asyncHandler(async (req, res) => {
  const { topicId } = req.params;
  const { type, title, url, description, difficulty, duration, source, thumbnail, author } = req.body;
  const userId = req.dbUser.id;
  
  const topic = await Topic.findByPk(topicId);
  if (!topic) {
    throw new NotFoundError('Topic');
  }
  
  const resource = await Resource.create({
    topic_id: topicId,
    type,
    title,
    url,
    description,
    difficulty,
    duration,
    source,
    thumbnail,
    author,
    created_by: userId
  });
  
  // Invalidate cache
  await cacheService.del(`topic:${topic.slug}`);
  
  res.status(201).json({
    message: 'Resource added successfully',
    resource
  });
});

// Update resource
export const updateResource = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;
  const updates = req.body;
  
  const resource = await Resource.findByPk(resourceId);
  if (!resource) {
    throw new NotFoundError('Resource');
  }
  
  await resource.update(updates);
  
  res.json({
    message: 'Resource updated successfully',
    resource
  });
});

// Delete resource
export const deleteResource = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;
  
  const resource = await Resource.findByPk(resourceId);
  if (!resource) {
    throw new NotFoundError('Resource');
  }
  
  await resource.destroy();
  
  res.json({ message: 'Resource deleted successfully' });
});

export default {
  getAllTopics,
  getTopicBySlug,
  createTopic,
  updateTopic,
  deleteTopic,
  getTopicResources,
  addResource,
  updateResource,
  deleteResource
};

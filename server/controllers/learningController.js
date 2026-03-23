import { LearningProgress, Topic, Submission, Problem } from '../models/index.js';
import { asyncHandler, NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import spacedRepetition from '../services/spacedRepetitionService.js';
import { cacheService } from '../config/redis.js';
import { Op } from 'sequelize';

// Get user learning progress
export const getLearningProgress = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  
  const progress = await LearningProgress.findAll({
    where: { user_id: userId },
    include: [{
      model: Topic,
      as: 'topic',
      attributes: ['id', 'name', 'slug', 'difficulty', 'icon', 'color']
    }],
    order: [['updated_at', 'DESC']]
  });
  
  res.json({ progress });
});

// Start learning a topic
export const startTopic = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { topicId } = req.params;
  
  // Check if topic exists
  const topic = await Topic.findByPk(topicId);
  if (!topic) {
    throw new NotFoundError('Topic');
  }
  
  // Check if already started
  let progress = await LearningProgress.findOne({
    where: { user_id: userId, topic_id: topicId }
  });
  
  if (progress) {
    return res.json({
      message: 'Topic already started',
      progress
    });
  }
  
  // Create new progress
  progress = await LearningProgress.create({
    user_id: userId,
    topic_id: topicId,
    status: 'in_progress',
    progress: 0,
    started_at: new Date()
  });
  
  res.status(201).json({
    message: 'Topic started successfully',
    progress
  });
});

// Update learning progress
export const updateProgress = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { topicId } = req.params;
  const { progress, timeSpent, notes } = req.body;
  
  const learningProgress = await LearningProgress.findOne({
    where: { user_id: userId, topic_id: topicId }
  });
  
  if (!learningProgress) {
    throw new NotFoundError('Learning progress');
  }
  
  const updates = {};
  if (progress !== undefined) updates.progress = progress;
  if (timeSpent !== undefined) updates.time_spent = learningProgress.time_spent + timeSpent;
  if (notes !== undefined) updates.notes = notes;
  
  await learningProgress.update(updates);
  
  res.json({
    message: 'Progress updated successfully',
    progress: learningProgress
  });
});

// Complete a topic
export const completeTopic = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { topicId } = req.params;
  const { quality = 3 } = req.body; // Quality of learning (0-5)
  
  const learningProgress = await LearningProgress.findOne({
    where: { user_id: userId, topic_id: topicId }
  });
  
  if (!learningProgress) {
    throw new NotFoundError('Learning progress');
  }
  
  // Calculate next revision using spaced repetition
  const { nextRevision, revisionLevel } = spacedRepetition.calculateNextRevision(
    learningProgress.revision_level,
    quality
  );
  
  await learningProgress.update({
    status: 'completed',
    progress: 100,
    completed_at: new Date(),
    next_revision: nextRevision,
    revision_level: revisionLevel
  });
  
  // Calculate mastery score
  const submissions = await Submission.findAll({
    include: [{
      model: Problem,
      as: 'problem',
      where: { topic_id: topicId }
    }],
    where: { user_id: userId }
  });
  
  const problemsSolved = submissions.filter(s => s.verdict === 'accepted').length;
  const accuracy = submissions.length > 0 
    ? (problemsSolved / submissions.length) * 100 
    : 0;
  
  const masteryScore = spacedRepetition.calculateMasteryScore({
    revisionLevel,
    progress: 100,
    timeSpent: learningProgress.time_spent,
    problemsSolved,
    accuracy
  });
  
  await learningProgress.update({ mastery_score: masteryScore });
  
  res.json({
    message: 'Topic completed successfully',
    progress: learningProgress,
    nextRevision,
    masteryScore
  });
});

// Get due revisions
export const getDueRevisions = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  
  const now = new Date();
  
  const revisions = await LearningProgress.findAll({
    where: {
      user_id: userId,
      status: 'completed',
      next_revision: { [Op.lte]: now }
    },
    include: [{
      model: Topic,
      as: 'topic',
      attributes: ['id', 'name', 'slug', 'difficulty', 'icon', 'color']
    }],
    order: [['next_revision', 'ASC']]
  });
  
  res.json({ revisions });
});

// Complete a revision
export const completeRevision = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { topicId } = req.params;
  const { quality = 3 } = req.body;
  
  const learningProgress = await LearningProgress.findOne({
    where: { user_id: userId, topic_id: topicId }
  });
  
  if (!learningProgress) {
    throw new NotFoundError('Learning progress');
  }
  
  const { nextRevision, revisionLevel } = spacedRepetition.calculateNextRevision(
    learningProgress.revision_level,
    quality
  );
  
  await learningProgress.update({
    next_revision: nextRevision,
    revision_level: revisionLevel,
    last_revision_at: new Date()
  });
  
  res.json({
    message: 'Revision completed successfully',
    progress: learningProgress,
    nextRevision
  });
});

// Get learning schedule
export const getLearningSchedule = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  
  const topics = await Topic.findAll({
    where: { status: 'published' }
  });
  
  const userProgress = await LearningProgress.findAll({
    where: { user_id: userId },
    include: [{
      model: Topic,
      as: 'topic'
    }]
  });
  
  const schedule = spacedRepetition.generateLearningSchedule(topics, userProgress);
  
  res.json({ schedule });
});

// Get learning dashboard
export const getLearningDashboard = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  
  // Get all progress
  const allProgress = await LearningProgress.findAll({
    where: { user_id: userId },
    include: [{
      model: Topic,
      as: 'topic',
      attributes: ['id', 'name', 'slug', 'difficulty', 'icon', 'color']
    }]
  });
  
  // Calculate stats
  const completed = allProgress.filter(p => p.status === 'completed');
  const inProgress = allProgress.filter(p => p.status === 'in_progress');
  
  // Get due revisions
  const now = new Date();
  const dueRevisions = allProgress.filter(p => 
    p.status === 'completed' && 
    p.next_revision && 
    new Date(p.next_revision) <= now
  );
  
  // Get submissions count
  const totalSubmissions = await Submission.count({ where: { user_id: userId } });
  const acceptedSubmissions = await Submission.count({
    where: { user_id: userId, verdict: 'accepted' }
  });
  
  // Weekly progress (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const weeklyProgress = await LearningProgress.findAll({
    where: {
      user_id: userId,
      updated_at: { [Op.gte]: weekAgo }
    }
  });
  
  // Recommended topics
  const completedTopicIds = completed.map(p => p.topic_id);
  const allTopics = await Topic.findAll({ where: { status: 'published' } });
  const recommended = spacedRepetition.recommendNextTopic(
    completed.map(p => ({ topic_id: p.topic_id, difficulty: p.topic?.difficulty })),
    allTopics,
    null
  );
  
  res.json({
    stats: {
      topicsCompleted: completed.length,
      topicsInProgress: inProgress.length,
      dueRevisions: dueRevisions.length,
      totalSubmissions,
      acceptedSubmissions,
      acceptanceRate: totalSubmissions > 0 
        ? Math.round((acceptedSubmissions / totalSubmissions) * 100) 
        : 0
    },
    inProgress: inProgress.slice(0, 5),
    dueRevisions: dueRevisions.slice(0, 5),
    recentActivity: weeklyProgress,
    recommendedTopics: recommended.slice(0, 5)
  });
});

export default {
  getLearningProgress,
  startTopic,
  updateProgress,
  completeTopic,
  getDueRevisions,
  completeRevision,
  getLearningSchedule,
  getLearningDashboard
};

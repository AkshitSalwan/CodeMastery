import { Feedback, User } from '../models/index.js';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';

// Get all public feedback
export const getAllFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findAll({
    where: { is_published: true },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'avatar']
    }],
    order: [['created_at', 'DESC']],
    limit: 100
  });
  
  res.json({ feedback });
});

// Get user's feedback
export const getUserFeedback = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  
  const feedback = await Feedback.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit: 50
  });
  
  res.json({ feedback });
});

// Create feedback
export const createFeedback = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { type = 'general', rating = 5, message } = req.body;
  
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  const feedback = await Feedback.create({
    user_id: userId,
    type,
    rating,
    message,
    is_published: true
  });
  
  res.status(201).json({
    message: 'Feedback submitted successfully',
    feedback
  });
});

// Get feedback stats (admin)
export const getFeedbackStats = asyncHandler(async (req, res) => {
  const total = await Feedback.count();
  const avgRating = await Feedback.findOne({
    attributes: [
      ['AVG(rating)', 'avgRating']
    ],
    raw: true
  });
  
  const byType = await Feedback.findAll({
    attributes: ['type', [Feedback.sequelize.fn('COUNT', Feedback.sequelize.col('id')), 'count']],
    group: ['type'],
    raw: true
  });
  
  res.json({
    stats: {
      total,
      avgRating: parseFloat(avgRating?.avgRating || 0).toFixed(2),
      byType
    }
  });
});

export default {
  getAllFeedback,
  getUserFeedback,
  createFeedback,
  getFeedbackStats
};

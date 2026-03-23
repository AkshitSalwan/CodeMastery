import { Badge, UserBadge, User, Submission, LearningProgress, UserDPPProgress } from '../models/index.js';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';

// Get all badges
export const getAllBadges = asyncHandler(async (req, res) => {
  const badges = await Badge.findAll({
    where: { is_active: true },
    order: [['category', 'ASC'], ['rarity', 'ASC']]
  });
  
  res.json({ badges });
});

// Get user badges
export const getUserBadges = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const userBadges = await UserBadge.findAll({
    where: { user_id: userId },
    include: [{
      model: Badge,
      as: 'badge'
    }],
    order: [['earned_at', 'DESC']]
  });
  
  res.json({ badges: userBadges });
});

// Create badge (Admin)
export const createBadge = asyncHandler(async (req, res) => {
  const { name, slug, description, icon, color, category, criteria, points, rarity } = req.body;
  
  const badge = await Badge.create({
    name,
    slug,
    description,
    icon,
    color,
    category,
    criteria,
    points,
    rarity
  });
  
  res.status(201).json({
    message: 'Badge created successfully',
    badge
  });
});

// Award badge to user (Admin)
export const awardBadge = asyncHandler(async (req, res) => {
  const { userId, badgeId } = req.body;
  
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User');
  }
  
  const badge = await Badge.findByPk(badgeId);
  if (!badge) {
    throw new NotFoundError('Badge');
  }
  
  // Check if already awarded
  const existing = await UserBadge.findOne({
    where: { user_id: userId, badge_id: badgeId }
  });
  
  if (existing) {
    return res.json({ message: 'Badge already awarded', userBadge: existing });
  }
  
  const userBadge = await UserBadge.create({
    user_id: userId,
    badge_id: badgeId
  });
  
  res.status(201).json({
    message: 'Badge awarded successfully',
    userBadge
  });
});

// Check and award badges automatically
export const checkAndAwardBadges = async (userId) => {
  const awardedBadges = [];
  
  // Get user stats
  const submissions = await Submission.findAll({ where: { user_id: userId } });
  const learningProgress = await LearningProgress.findAll({ where: { user_id: userId } });
  const dppProgress = await UserDPPProgress.findOne({
    where: { user_id: userId },
    order: [['date', 'DESC']]
  });
  
  const acceptedSubmissions = submissions.filter(s => s.verdict === 'accepted');
  const completedTopics = learningProgress.filter(p => p.status === 'completed');
  
  // Get all badges
  const badges = await Badge.findAll({ where: { is_active: true } });
  
  for (const badge of badges) {
    // Skip if already earned
    const existing = await UserBadge.findOne({
      where: { user_id: userId, badge_id: badge.id }
    });
    
    if (existing) continue;
    
    let shouldAward = false;
    
    // Check criteria
    switch (badge.slug) {
      case 'first-solve':
        shouldAward = acceptedSubmissions.length >= 1;
        break;
      case 'beginner-solver':
        shouldAward = acceptedSubmissions.length >= 10;
        break;
      case 'problem-solver-50':
        shouldAward = acceptedSubmissions.length >= 50;
        break;
      case 'problem-solver-100':
        shouldAward = acceptedSubmissions.length >= 100;
        break;
      case 'first-topic':
        shouldAward = completedTopics.length >= 1;
        break;
      case 'topic-master-5':
        shouldAward = completedTopics.length >= 5;
        break;
      case 'topic-master-10':
        shouldAward = completedTopics.length >= 10;
        break;
      case '7-day-streak':
        shouldAward = dppProgress?.streak >= 7;
        break;
      case '30-day-streak':
        shouldAward = dppProgress?.streak >= 30;
        break;
      case 'contest-winner':
        // Check contest wins (would need contest logic)
        break;
    }
    
    if (shouldAward) {
      await UserBadge.create({
        user_id: userId,
        badge_id: badge.id
      });
      awardedBadges.push(badge);
    }
  }
  
  return awardedBadges;
};

// Get badge leaderboard
export const getBadgeLeaderboard = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;
  
  const topUsers = await UserBadge.findAll({
    attributes: [
      'user_id',
      [sequelize.fn('COUNT', sequelize.col('badge_id')), 'badgeCount'],
      [sequelize.fn('SUM', sequelize.literal('Badge.points')), 'totalPoints']
    ],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      },
      {
        model: Badge,
        as: 'badge',
        attributes: []
      }
    ],
    group: ['user_id'],
    order: [[sequelize.literal('totalPoints'), 'DESC']],
    limit: parseInt(limit)
  });
  
  res.json({ leaderboard: topUsers });
});

export default {
  getAllBadges,
  getUserBadges,
  createBadge,
  awardBadge,
  checkAndAwardBadges,
  getBadgeLeaderboard
};

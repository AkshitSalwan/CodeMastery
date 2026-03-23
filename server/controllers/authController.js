import { User, LearningProgress, Submission, UserBadge, UserDPPProgress } from '../models/index.js';
import { asyncHandler, NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { cacheService } from '../config/redis.js';

// Get current user
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.dbUser;
  
  // Get user stats
  const stats = await getUserStats(user.id);
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      github_url: user.github_url,
      linkedin_url: user.linkedin_url,
      created_at: user.created_at
    },
    stats
  });
});

// Update user profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = req.dbUser;
  const { username, bio, github_url, linkedin_url, avatar } = req.body;
  
  // Check if username is taken
  if (username && username !== user.username) {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new ValidationError('Username already taken');
    }
  }
  
  await user.update({
    username: username || user.username,
    bio: bio !== undefined ? bio : user.bio,
    github_url: github_url !== undefined ? github_url : user.github_url,
    linkedin_url: linkedin_url !== undefined ? linkedin_url : user.linkedin_url,
    avatar: avatar || user.avatar
  });
  
  // Invalidate cache
  await cacheService.del(`user:${user.id}`);
  
  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      bio: user.bio,
      github_url: user.github_url,
      linkedin_url: user.linkedin_url,
      avatar: user.avatar
    }
  });
});

// Handle Clerk webhook
export const handleClerkWebhook = asyncHandler(async (req, res) => {
  const { type, data } = req.body;
  
  switch (type) {
    case 'user.created':
      await handleUserCreated(data);
      break;
    case 'user.updated':
      await handleUserUpdated(data);
      break;
    case 'user.deleted':
      await handleUserDeleted(data);
      break;
    default:
      console.log(`Unhandled webhook type: ${type}`);
  }
  
  res.json({ received: true });
});

// Helper: Handle user created
async function handleUserCreated(data) {
  const email = data.email_addresses?.[0]?.email_address || '';
  const username = data.username || email.split('@')[0];
  
  await User.findOrCreate({
    where: { clerk_id: data.id },
    defaults: {
      clerk_id: data.id,
      email: email,
      username: username,
      avatar: data.image_url,
      role: 'learner'
    }
  });
}

// Helper: Handle user updated
async function handleUserUpdated(data) {
  const user = await User.findOne({ where: { clerk_id: data.id } });
  if (user) {
    const email = data.email_addresses?.[0]?.email_address || user.email;
    await user.update({
      email,
      avatar: data.image_url || user.avatar
    });
  }
}

// Helper: Handle user deleted
async function handleUserDeleted(data) {
  await User.destroy({ where: { clerk_id: data.id } });
}

// Helper: Get user stats
async function getUserStats(userId) {
  const [
    learningProgress,
    submissions,
    badges,
    dppProgress
  ] = await Promise.all([
    LearningProgress.findAll({ where: { user_id: userId } }),
    Submission.findAll({ where: { user_id: userId } }),
    UserBadge.findAll({ 
      where: { user_id: userId },
      include: ['badge']
    }),
    UserDPPProgress.findOne({ 
      where: { user_id: userId },
      order: [['date', 'DESC']]
    })
  ]);
  
  const completedTopics = learningProgress.filter(p => p.status === 'completed').length;
  const totalSubmissions = submissions.length;
  const acceptedSubmissions = submissions.filter(s => s.verdict === 'accepted').length;
  const currentStreak = dppProgress?.streak || 0;
  
  return {
    topicsCompleted: completedTopics,
    topicsInProgress: learningProgress.filter(p => p.status === 'in_progress').length,
    totalSubmissions,
    acceptedSubmissions,
    acceptanceRate: totalSubmissions > 0 
      ? Math.round((acceptedSubmissions / totalSubmissions) * 100) 
      : 0,
    badgesEarned: badges.length,
    currentStreak,
    maxStreak: dppProgress?.max_streak || 0
  };
}

// Get user public profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const user = await User.findByPk(userId, {
    attributes: ['id', 'username', 'avatar', 'bio', 'github_url', 'linkedin_url', 'created_at']
  });
  
  if (!user) {
    throw new NotFoundError('User');
  }
  
  const stats = await getUserStats(userId);
  
  res.json({ user, stats });
});

// Admin: Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;
  
  const whereClause = {};
  if (role) whereClause.role = role;
  if (search) {
    whereClause[Op.or] = [
      { username: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } }
    ];
  }
  
  const { count, rows: users } = await User.findAndCountAll({
    where: whereClause,
    attributes: ['id', 'username', 'email', 'role', 'avatar', 'is_active', 'created_at', 'last_login'],
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    order: [['created_at', 'DESC']]
  });
  
  res.json({
    users,
    pagination: {
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit))
    }
  });
});

// Admin: Update user role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User');
  }
  
  await user.update({ role });
  
  res.json({
    message: 'User role updated successfully',
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
});

export default {
  getCurrentUser,
  updateProfile,
  handleClerkWebhook,
  getUserProfile,
  getAllUsers,
  updateUserRole
};

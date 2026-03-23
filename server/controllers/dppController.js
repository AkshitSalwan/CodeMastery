import { DailyProblem, UserDPPProgress, Submission, Problem, User } from '../models/index.js';
import { asyncHandler, NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { cacheService } from '../config/redis.js';
import { Op } from 'sequelize';

// Get today's DPP
export const getTodayDPP = asyncHandler(async (req, res) => {
  const userId = req.dbUser?.id;
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's problems
  let dailyProblem = await DailyProblem.findOne({
    where: { date: today }
  });
  
  // Generate if not exists
  if (!dailyProblem) {
    dailyProblem = await generateDailyProblems(today);
  }
  
  // Get problems
  const problems = await Problem.findAll({
    where: { 
      id: dailyProblem.problem_ids,
      status: 'published'
    },
    attributes: ['id', 'title', 'slug', 'difficulty', 'points', 'tags']
  });
  
  // Get user's progress for today
  let userProgress = null;
  if (userId) {
    userProgress = await UserDPPProgress.findOne({
      where: { user_id: userId, date: today }
    });
    
    // Get submission status for each problem
    const submissions = await Submission.findAll({
      where: {
        user_id: userId,
        problem_id: dailyProblem.problem_ids,
        submitted_at: {
          [Op.gte]: new Date(today)
        }
      }
    });
    
    const problemStatus = {};
    submissions.forEach(s => {
      if (!problemStatus[s.problem_id] || s.verdict === 'accepted') {
        problemStatus[s.problem_id] = s.verdict;
      }
    });
    
    problems.forEach(p => {
      p.userStatus = problemStatus[p.id] || 'not_attempted';
    });
  }
  
  res.json({
    date: today,
    problems,
    userProgress
  });
});

// Generate daily problems
async function generateDailyProblems(date) {
  // Get random problems with mixed difficulty
  const easyProblems = await Problem.findAll({
    where: { difficulty: 'easy', status: 'published' },
    order: [sequelize.literal('RAND()')],
    limit: 1
  });
  
  const mediumProblems = await Problem.findAll({
    where: { difficulty: 'medium', status: 'published' },
    order: [sequelize.literal('RAND()')],
    limit: 1
  });
  
  const hardProblems = await Problem.findAll({
    where: { difficulty: 'hard', status: 'published' },
    order: [sequelize.literal('RAND()')],
    limit: 1
  });
  
  const problemIds = [
    ...easyProblems.map(p => p.id),
    ...mediumProblems.map(p => p.id),
    ...hardProblems.map(p => p.id)
  ];
  
  return await DailyProblem.create({
    date,
    problem_ids: problemIds,
    difficulty_mix: { easy: 1, medium: 1, hard: 1 }
  });
}

// Update DPP progress
export const updateDPPProgress = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const today = new Date().toISOString().split('T')[0];
  
  const dailyProblem = await DailyProblem.findOne({
    where: { date: today }
  });
  
  if (!dailyProblem) {
    throw new NotFoundError('Daily problems');
  }
  
  // Get user's submissions for today
  const submissions = await Submission.findAll({
    where: {
      user_id: userId,
      problem_id: dailyProblem.problem_ids,
      verdict: 'accepted',
      submitted_at: {
        [Op.gte]: new Date(today)
      }
    }
  });
  
  const problemsSolved = new Set(submissions.map(s => s.problem_id)).size;
  const totalProblems = dailyProblem.problem_ids.length;
  const completed = problemsSolved === totalProblems;
  
  // Get or create progress
  let progress = await UserDPPProgress.findOne({
    where: { user_id: userId, date: today }
  });
  
  if (!progress) {
    // Calculate streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const yesterdayProgress = await UserDPPProgress.findOne({
      where: { user_id: userId, date: yesterdayStr, completed: true }
    });
    
    const streak = yesterdayProgress ? yesterdayProgress.streak + 1 : 1;
    
    progress = await UserDPPProgress.create({
      user_id: userId,
      date: today,
      problems_solved: problemsSolved,
      total_problems: totalProblems,
      streak,
      max_streak: streak,
      completed
    });
  } else {
    await progress.update({
      problems_solved: problemsSolved,
      completed
    });
  }
  
  // Update max streak if needed
  if (progress.streak > progress.max_streak) {
    await progress.update({ max_streak: progress.streak });
  }
  
  res.json({
    progress,
    problemsSolved,
    totalProblems,
    completed
  });
});

// Get user's DPP streak
export const getDPPStreak = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  
  // Get latest progress
  const latestProgress = await UserDPPProgress.findOne({
    where: { user_id: userId },
    order: [['date', 'DESC']]
  });
  
  // Check if streak is still active
  let currentStreak = 0;
  let maxStreak = latestProgress?.max_streak || 0;
  
  if (latestProgress) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (latestProgress.date === today || latestProgress.date === yesterdayStr) {
      currentStreak = latestProgress.streak;
    }
  }
  
  // Get last 30 days progress
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentProgress = await UserDPPProgress.findAll({
    where: {
      user_id: userId,
      date: { [Op.gte]: thirtyDaysAgo }
    },
    order: [['date', 'ASC']]
  });
  
  res.json({
    currentStreak,
    maxStreak,
    recentProgress
  });
});

// Get DPP leaderboard
export const getDPPLeaderboard = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;
  
  const cacheKey = 'dpp:leaderboard';
  let leaderboard = await cacheService.get(cacheKey);
  
  if (!leaderboard) {
    // Get users with highest max streaks
    const topUsers = await UserDPPProgress.findAll({
      attributes: [
        'user_id',
        [sequelize.fn('MAX', sequelize.col('max_streak')), 'max_streak'],
        [sequelize.fn('MAX', sequelize.col('streak')), 'current_streak']
      ],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }],
      group: ['user_id'],
      order: [[sequelize.literal('max_streak'), 'DESC']],
      limit: parseInt(limit)
    });
    
    leaderboard = topUsers.map((p, index) => ({
      rank: index + 1,
      userId: p.user_id,
      username: p.user?.username,
      avatar: p.user?.avatar,
      currentStreak: p.current_streak,
      maxStreak: p.max_streak
    }));
    
    await cacheService.set(cacheKey, leaderboard, 3600); // Cache for 1 hour
  }
  
  res.json({ leaderboard });
});

// Get DPP history
export const getDPPHistory = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { days = 30 } = req.query;
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));
  
  const history = await UserDPPProgress.findAll({
    where: {
      user_id: userId,
      date: { [Op.gte]: startDate }
    },
    order: [['date', 'ASC']]
  });
  
  res.json({ history });
});

export default {
  getTodayDPP,
  updateDPPProgress,
  getDPPStreak,
  getDPPLeaderboard,
  getDPPHistory
};

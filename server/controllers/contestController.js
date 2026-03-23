import { Contest, ContestParticipant, ContestSubmission, Problem, Submission, User } from '../models/index.js';
import { asyncHandler, NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { cacheService } from '../config/redis.js';
import { Op } from 'sequelize';
import { getSocketIO } from '../socket/index.js';

// Get all contests
export const getAllContests = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, type } = req.query;
  
  const whereClause = {};
  if (status) whereClause.status = status;
  if (type) whereClause.contest_type = type;
  
  const { count, rows: contests } = await Contest.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    order: [['start_time', 'DESC']],
    include: [{
      model: User,
      as: 'creator',
      attributes: ['id', 'username', 'avatar']
    }]
  });
  
  res.json({
    contests,
    pagination: {
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit))
    }
  });
});

// Get contest by ID
export const getContestById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.dbUser?.id;
  
  const contest = await Contest.findByPk(id, {
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'username', 'avatar']
      },
      {
        model: Problem,
        as: 'contestProblems',
        attributes: ['id', 'title', 'slug', 'difficulty', 'points']
      }
    ]
  });
  
  if (!contest) {
    throw new NotFoundError('Contest');
  }
  
  // Check if user is registered
  let participation = null;
  if (userId) {
    participation = await ContestParticipant.findOne({
      where: { contest_id: id, user_id: userId }
    });
  }
  
  // Hide problems if contest hasn't started
  const now = new Date();
  const contestData = contest.toJSON();
  
  if (now < new Date(contest.start_time)) {
    contestData.problems = contest.problems?.map(id => ({ id }));
    contestData.contestProblems = [];
  }
  
  res.json({
    contest: contestData,
    participation
  });
});

// Create contest (Interviewer/Admin)
export const createContest = asyncHandler(async (req, res) => {
  const {
    title, slug, description, start_time, end_time,
    problems, rules, scoring, penalty, max_participants,
    visibility, contest_type, prizes, banner_image
  } = req.body;
  const userId = req.dbUser.id;
  
  // Check if slug exists
  const existingContest = await Contest.findOne({ where: { slug } });
  if (existingContest) {
    throw new ValidationError('Contest with this slug already exists');
  }
  
  // Calculate duration
  const start = new Date(start_time);
  const end = new Date(end_time);
  const duration = Math.round((end - start) / (1000 * 60)); // in minutes
  
  const contest = await Contest.create({
    title,
    slug,
    description,
    start_time,
    end_time,
    duration,
    problems,
    rules,
    scoring,
    penalty: penalty || 10,
    max_participants,
    visibility: visibility || 'public',
    contest_type: contest_type || 'special',
    prizes,
    banner_image,
    created_by: userId,
    status: 'upcoming'
  });
  
  res.status(201).json({
    message: 'Contest created successfully',
    contest
  });
});

// Update contest
export const updateContest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const contest = await Contest.findByPk(id);
  if (!contest) {
    throw new NotFoundError('Contest');
  }
  
  // Don't allow updates if contest is ongoing
  if (contest.status === 'ongoing') {
    throw new ValidationError('Cannot update an ongoing contest');
  }
  
  await contest.update(updates);
  
  res.json({
    message: 'Contest updated successfully',
    contest
  });
});

// Delete contest
export const deleteContest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const contest = await Contest.findByPk(id);
  if (!contest) {
    throw new NotFoundError('Contest');
  }
  
  if (contest.status === 'ongoing') {
    throw new ValidationError('Cannot delete an ongoing contest');
  }
  
  await contest.destroy();
  
  res.json({ message: 'Contest deleted successfully' });
});

// Register for contest
export const registerForContest = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { id } = req.params;
  
  const contest = await Contest.findByPk(id);
  if (!contest) {
    throw new NotFoundError('Contest');
  }
  
  // Check if already registered
  const existing = await ContestParticipant.findOne({
    where: { contest_id: id, user_id: userId }
  });
  
  if (existing) {
    return res.json({ message: 'Already registered', participation: existing });
  }
  
  // Check max participants
  if (contest.max_participants && contest.participants_count >= contest.max_participants) {
    throw new ValidationError('Contest is full');
  }
  
  // Create participation
  const participation = await ContestParticipant.create({
    contest_id: id,
    user_id: userId,
    status: 'registered'
  });
  
  // Increment participant count
  await contest.increment('participants_count');
  
  res.status(201).json({
    message: 'Registered successfully',
    participation
  });
});

// Join contest (when it starts)
export const joinContest = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { id } = req.params;
  
  const contest = await Contest.findByPk(id);
  if (!contest) {
    throw new NotFoundError('Contest');
  }
  
  const now = new Date();
  const startTime = new Date(contest.start_time);
  const endTime = new Date(contest.end_time);
  
  // Check if contest is active
  if (now < startTime) {
    throw new ValidationError('Contest has not started yet');
  }
  
  if (now > endTime) {
    throw new ValidationError('Contest has ended');
  }
  
  // Update contest status if needed
  if (contest.status === 'upcoming') {
    await contest.update({ status: 'ongoing' });
  }
  
  // Get or create participation
  let participation = await ContestParticipant.findOne({
    where: { contest_id: id, user_id: userId }
  });
  
  if (!participation) {
    // Auto-register if public contest
    if (contest.visibility === 'public') {
      participation = await ContestParticipant.create({
        contest_id: id,
        user_id: userId,
        status: 'participating'
      });
      await contest.increment('participants_count');
    } else {
      throw new ValidationError('Not registered for this contest');
    }
  } else {
    await participation.update({ status: 'participating' });
  }
  
  // Get problems
  const problems = await Problem.findAll({
    where: { id: contest.problems },
    attributes: ['id', 'title', 'slug', 'difficulty', 'points', 'constraints', 'examples']
  });
  
  res.json({
    contest,
    problems,
    participation
  });
});

// Submit contest solution
export const submitContestSolution = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { contestId, problemId } = req.params;
  const { code, language } = req.body;
  
  const contest = await Contest.findByPk(contestId);
  if (!contest) {
    throw new NotFoundError('Contest');
  }
  
  // Check if contest is active
  const now = new Date();
  if (now < new Date(contest.start_time) || now > new Date(contest.end_time)) {
    throw new ValidationError('Contest is not active');
  }
  
  // Get participation
  const participation = await ContestParticipant.findOne({
    where: { contest_id: contestId, user_id: userId }
  });
  
  if (!participation) {
    throw new ValidationError('Not participating in this contest');
  }
  
  // Check if problem is already solved
  const existingAccepted = await ContestSubmission.findOne({
    where: {
      contest_id: contestId,
      participant_id: participation.id,
      problem_id: problemId,
      is_accepted: true
    }
  });
  
  if (existingAccepted) {
    throw new ValidationError('Problem already solved');
  }
  
  // Create submission
  const submission = await Submission.create({
    user_id: userId,
    problem_id: problemId,
    code,
    language,
    language_id: 63, // JavaScript
    verdict: 'pending',
    status: 'processing'
  });
  
  // Get problem and run tests
  const problem = await Problem.findByPk(problemId);
  const allTestCases = [...(problem.test_cases || []), ...(problem.hidden_test_cases || [])];
  
  let passedCount = 0;
  let totalRuntime = 0;
  
  for (const testCase of allTestCases) {
    const { executeCode } = await import('../services/judge0Service.js');
    const result = await executeCode(code, language, testCase.input);
    
    if (result.stdout?.trim() === testCase.output?.trim()) {
      passedCount++;
    }
    
    if (result.time) totalRuntime = Math.max(totalRuntime, result.time);
  }
  
  const isAccepted = passedCount === allTestCases.length;
  const verdict = isAccepted ? 'accepted' : 'wrong_answer';
  
  await submission.update({
    verdict,
    status: 'completed',
    passed_tests: passedCount,
    total_tests: allTestCases.length,
    runtime: totalRuntime
  });
  
  // Calculate time from start
  const timeFromStart = Math.round((now - new Date(contest.start_time)) / 1000);
  
  // Create contest submission
  const contestSubmission = await ContestSubmission.create({
    contest_id: contestId,
    participant_id: participation.id,
    problem_id: problemId,
    submission_id: submission.id,
    score: isAccepted ? problem.points : 0,
    verdict,
    time_submitted: now,
    time_from_start: timeFromStart,
    penalty: isAccepted ? 0 : contest.penalty * 60, // Convert to seconds
    is_accepted: isAccepted,
    attempt_number: await ContestSubmission.count({
      where: { contest_id: contestId, participant_id: participation.id, problem_id: problemId }
    }) + 1
  });
  
  // Update participation if accepted
  if (isAccepted) {
    const solvedCount = await ContestSubmission.count({
      where: { participant_id: participation.id, is_accepted: true }
    });
    
    const totalScore = await ContestSubmission.sum('score', {
      where: { participant_id: participation.id, is_accepted: true }
    });
    
    const totalPenalty = await ContestSubmission.sum('penalty', {
      where: { participant_id: participation.id }
    });
    
    await participation.update({
      score: totalScore,
      problems_solved: solvedCount,
      total_time: timeFromStart,
      penalty: totalPenalty
    });
    
    // Update leaderboard
    await updateLeaderboard(contestId, participation);
  }
  
  res.json({
    submission,
    contestSubmission,
    isAccepted
  });
});

// Update leaderboard
async function updateLeaderboard(contestId, participation) {
  const leaderboardKey = `contest:${contestId}:leaderboard`;
  
  // Add to Redis sorted set (score as primary, time as secondary)
  const score = participation.score * 1000000 - (participation.total_time + participation.penalty);
  await cacheService.addToLeaderboard(leaderboardKey, participation.user_id, score);
  
  // Get all participants sorted
  const leaderboardData = await cacheService.getLeaderboard(leaderboardKey, 0, -1);
  
  // Emit leaderboard update
  const io = getSocketIO();
  io.to(`contest:${contestId}`).emit('contest:leaderboard:update', {
    leaderboard: leaderboardData
  });
}

// Get contest leaderboard
export const getContestLeaderboard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const cacheKey = `contest:${id}:leaderboard`;
  
  // Try to get from cache
  let leaderboardData = await cacheService.getLeaderboard(cacheKey, 0, -1);
  
  if (!leaderboardData || leaderboardData.length === 0) {
    // Generate from database
    const participants = await ContestParticipant.findAll({
      where: { contest_id: id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [
        ['score', 'DESC'],
        ['total_time', 'ASC'],
        ['penalty', 'ASC']
      ]
    });
    
    leaderboardData = participants.map((p, index) => ({
      rank: index + 1,
      userId: p.user_id,
      username: p.user?.username,
      avatar: p.user?.avatar,
      score: p.score,
      problemsSolved: p.problems_solved,
      totalTime: p.total_time,
      penalty: p.penalty
    }));
    
    // Cache it
    for (const p of participants) {
      const score = p.score * 1000000 - (p.total_time + p.penalty);
      await cacheService.addToLeaderboard(cacheKey, p.user_id, score);
    }
  }
  
  res.json({ leaderboard: leaderboardData });
});

// Get user's contest submissions
export const getContestSubmissions = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { contestId } = req.params;
  
  const participation = await ContestParticipant.findOne({
    where: { contest_id: contestId, user_id: userId }
  });
  
  if (!participation) {
    throw new NotFoundError('Participation');
  }
  
  const submissions = await ContestSubmission.findAll({
    where: { participant_id: participation.id },
    include: [{
      model: Problem,
      as: 'problem',
      attributes: ['id', 'title', 'slug']
    }],
    order: [['time_submitted', 'DESC']]
  });
  
  res.json({ submissions });
});

export default {
  getAllContests,
  getContestById,
  createContest,
  updateContest,
  deleteContest,
  registerForContest,
  joinContest,
  submitContestSolution,
  getContestLeaderboard,
  getContestSubmissions
};

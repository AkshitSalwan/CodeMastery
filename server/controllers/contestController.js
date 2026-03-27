import { Contest, ContestParticipant, ContestSubmission, Problem, Submission, User } from '../models/index.js';
import { asyncHandler, NotFoundError, ValidationError, ForbiddenError } from '../middleware/errorHandler.js';
import { cacheService } from '../config/redis.js';
import { Op } from 'sequelize';
import { getSocketIO } from '../socket/index.js';
import judgeService from '../services/judgeService.js';
import compareOutput from '../utils/compareOutput.js';
import languageMap from '../utils/languageMap.js';

const toSafeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
};

const parseRules = (rules) => {
  if (Array.isArray(rules)) {
    return rules.map((rule) => String(rule).trim()).filter(Boolean);
  }
  if (typeof rules === 'string') {
    return rules
      .split('\n')
      .map((rule) => rule.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeContestStatus = async (contest) => {
  if (!contest || contest.status === 'cancelled') return contest;

  const now = new Date();
  const startTime = new Date(contest.start_time);
  const endTime = new Date(contest.end_time);
  let nextStatus = contest.status;

  if (now < startTime) nextStatus = 'upcoming';
  if (now >= startTime && now <= endTime) nextStatus = 'ongoing';
  if (now > endTime) nextStatus = 'completed';

  if (contest.status !== nextStatus) {
    await contest.update({ status: nextStatus });
  }

  return contest;
};

const attachContestTiming = (contestInstance) => {
  const contest = contestInstance?.toJSON ? contestInstance.toJSON() : contestInstance;
  const now = Date.now();
  const startMs = new Date(contest.start_time).getTime();
  const endMs = new Date(contest.end_time).getTime();

  return {
    ...contest,
    startsInSeconds: Math.max(0, Math.floor((startMs - now) / 1000)),
    endsInSeconds: Math.max(0, Math.floor((endMs - now) / 1000)),
    isCommencementOpen: now >= startMs && now <= endMs,
  };
};

// Get all contests
export const getAllContests = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, type } = req.query;
  const userId = req.dbUser?.id;

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

  for (const contest of contests) {
    await normalizeContestStatus(contest);
  }

  const contestIds = contests.map((contest) => contest.id);
  let participationByContest = {};
  if (userId && contestIds.length > 0) {
    const participations = await ContestParticipant.findAll({
      where: {
        contest_id: { [Op.in]: contestIds },
        user_id: userId
      }
    });
    participationByContest = participations.reduce((acc, participation) => {
      acc[participation.contest_id] = participation;
      return acc;
    }, {});
  }

  res.json({
    contests: contests.map((contest) => {
      const serialized = attachContestTiming(contest);
      const participation = participationByContest[contest.id] || null;
      return {
        ...serialized,
        participation_status: participation?.status || 'not_registered',
        my_score: participation?.score || 0,
        my_rank: participation?.rank || null
      };
    }),
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
      }
    ]
  });
  
  if (!contest) {
    throw new NotFoundError('Contest');
  }

  await normalizeContestStatus(contest);

  // Check if user is registered
  let participation = null;
  if (userId) {
    participation = await ContestParticipant.findOne({
      where: { contest_id: id, user_id: userId }
    });
  }
  
  // Hide problems if contest hasn't started
  const now = new Date();
  const contestData = attachContestTiming(contest);
  const contestProblemIds = toSafeArray(contestData.problems)
    .map((problemId) => parseInt(problemId, 10))
    .filter(Boolean);

  const contestProblems = contestProblemIds.length > 0
    ? await Problem.findAll({
        where: { id: { [Op.in]: contestProblemIds } },
        attributes: ['id', 'title', 'slug', 'difficulty', 'points']
      })
    : [];

  const orderedProblemMap = new Map(contestProblems.map((problem) => [problem.id, problem]));
  contestData.contestProblems = contestProblemIds
    .map((problemId) => orderedProblemMap.get(problemId))
    .filter(Boolean);

  if (now < new Date(contest.start_time)) {
    contestData.problems = contestProblemIds.map((problemId) => ({ id: problemId }));
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
  if (!['interviewer', 'admin'].includes(req.dbUser.role)) {
    throw new ForbiddenError('Only interviewer or admin can create contests');
  }

  const normalizedSlug = String(slug || title || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!normalizedSlug) {
    throw new ValidationError('Contest slug is required');
  }

  // Check if slug exists
  const existingContest = await Contest.findOne({ where: { slug: normalizedSlug } });
  if (existingContest) {
    throw new ValidationError('Contest with this slug already exists');
  }

  // Calculate duration
  const start = new Date(start_time);
  const end = new Date(end_time);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new ValidationError('Start and end time must be valid dates');
  }
  if (end <= start) {
    throw new ValidationError('Contest end time must be after start time');
  }

  const duration = Math.round((end - start) / (1000 * 60)); // in minutes

  const normalizedProblems = toSafeArray(problems).map((problemId) => parseInt(problemId, 10)).filter(Boolean);
  if (normalizedProblems.length === 0) {
    throw new ValidationError('At least one problem is required');
  }

  const existingProblems = await Problem.findAll({
    where: { id: normalizedProblems },
    attributes: ['id']
  });

  if (existingProblems.length !== normalizedProblems.length) {
    throw new ValidationError('One or more selected problems do not exist');
  }

  const contest = await Contest.create({
    title,
    slug: normalizedSlug,
    description,
    start_time,
    end_time,
    duration,
    problems: normalizedProblems,
    rules: JSON.stringify(parseRules(rules)),
    scoring,
    penalty: penalty || 10,
    max_participants: max_participants || null,
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

  if (!['interviewer', 'admin'].includes(req.dbUser.role)) {
    throw new ForbiddenError('Only interviewer or admin can update contests');
  }

  const contest = await Contest.findByPk(id);
  if (!contest) {
    throw new NotFoundError('Contest');
  }

  if (req.dbUser.role !== 'admin' && contest.created_by !== req.dbUser.id) {
    throw new ForbiddenError('You can only update contests created by you');
  }

  await normalizeContestStatus(contest);

  // Don't allow updates if contest is ongoing
  if (contest.status === 'ongoing') {
    throw new ValidationError('Cannot update an ongoing contest');
  }

  const preparedUpdates = { ...updates };
  if (preparedUpdates.slug) {
    preparedUpdates.slug = String(preparedUpdates.slug)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  if (preparedUpdates.rules != null) {
    preparedUpdates.rules = JSON.stringify(parseRules(preparedUpdates.rules));
  }

  if (preparedUpdates.problems != null) {
    preparedUpdates.problems = toSafeArray(preparedUpdates.problems)
      .map((problemId) => parseInt(problemId, 10))
      .filter(Boolean);
  }

  await contest.update(preparedUpdates);

  res.json({
    message: 'Contest updated successfully',
    contest
  });
});

// Delete contest
export const deleteContest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!['interviewer', 'admin'].includes(req.dbUser.role)) {
    throw new ForbiddenError('Only interviewer or admin can delete contests');
  }

  const contest = await Contest.findByPk(id);
  if (!contest) {
    throw new NotFoundError('Contest');
  }

  if (req.dbUser.role !== 'admin' && contest.created_by !== req.dbUser.id) {
    throw new ForbiddenError('You can only delete contests created by you');
  }

  await normalizeContestStatus(contest);

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
  await normalizeContestStatus(contest);

  if (contest.status === 'completed') {
    throw new ValidationError('Contest has already ended');
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
  await normalizeContestStatus(contest);

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
    await participation.update({
      status: 'participating',
      joined_at: participation.joined_at || now
    });
  }

  // Get problems
  const problems = await Problem.findAll({
    where: { id: contest.problems },
    attributes: ['id', 'title', 'slug', 'difficulty', 'points', 'constraints', 'examples']
  });
  
  res.json({
    contest: attachContestTiming(contest),
    problems,
    participation,
    remaining_seconds: Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000))
  });
});

// Submit contest solution
export const submitContestSolution = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { contestId, problemId } = req.params;
  const { code, language } = req.body;

  if (!code || !language) {
    throw new ValidationError('Code and language are required');
  }

  const languageId = languageMap[language];
  if (!languageId) {
    throw new ValidationError(`Unsupported language: ${language}`);
  }

  const contest = await Contest.findByPk(contestId);
  if (!contest) {
    throw new NotFoundError('Contest');
  }
  await normalizeContestStatus(contest);

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
    return res.json({
      message: 'Problem already solved in this contest',
      alreadySolved: true,
      isAccepted: true,
      testcaseScore: existingAccepted.score || 0,
      contestSubmission: existingAccepted,
      submission: {
        verdict: 'accepted',
        passed_tests: null,
        total_tests: null,
        test_results: []
      }
    });
  }
  
  const problem = await Problem.findByPk(problemId);
  if (!problem) {
    throw new NotFoundError('Problem');
  }

  if (!toSafeArray(contest.problems).map(Number).includes(Number(problemId))) {
    throw new ValidationError('Problem is not part of this contest');
  }

  // Create submission
  const submission = await Submission.create({
    user_id: userId,
    problem_id: problemId,
    code,
    language,
    language_id: languageId,
    verdict: 'pending',
    status: 'processing'
  });

  // Get problem and run tests
  const allTestCases = [...(problem.test_cases || []), ...(problem.hidden_test_cases || [])];
  if (allTestCases.length === 0) {
    throw new ValidationError('This problem has no test cases');
  }
  
  let passedCount = 0;
  let totalRuntime = 0;
  let totalMemory = 0;
  const visibleCount = (problem.test_cases || []).length;
  const testResults = [];
  
  for (const testCase of allTestCases) {
    const result = await judgeService.runJudge(language, code, testCase.input || '');
    const actualOutput = result.compile_output || result.stderr || result.stdout || '';
    const passed = compareOutput(actualOutput, testCase.output || '');

    if (passed) {
      passedCount++;
    }

    if (result.time) totalRuntime = Math.max(totalRuntime, parseFloat(result.time) || 0);
    if (result.memory) totalMemory = Math.max(totalMemory, parseFloat(result.memory) || 0);

    if (testResults.length < visibleCount) {
      testResults.push({
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput,
        passed,
        runtime: result.time || null,
        memory: result.memory || null,
        error: result.stderr || result.compile_output || result.message || null
      });
    }
  }
  
  const isAccepted = passedCount === allTestCases.length;
  const verdict = isAccepted ? 'accepted' : (passedCount > 0 ? 'partial' : 'wrong_answer');
  const testcaseScore = Math.round((passedCount / allTestCases.length) * (problem.points || 100));

  await submission.update({
    verdict,
    status: 'completed',
    passed_tests: passedCount,
    total_tests: allTestCases.length,
    runtime: totalRuntime,
    memory: totalMemory,
    test_results: testResults
  });

  // Calculate time from start
  const timeFromStart = Math.round((now - new Date(contest.start_time)) / 1000);
  
  // Create contest submission
  const contestSubmission = await ContestSubmission.create({
    contest_id: contestId,
    participant_id: participation.id,
    problem_id: problemId,
    submission_id: submission.id,
    score: testcaseScore,
    verdict,
    time_submitted: now,
    time_from_start: timeFromStart,
    penalty: isAccepted ? 0 : (contest.penalty || 10) * 60, // Convert to seconds
    is_accepted: isAccepted,
    attempt_number: await ContestSubmission.count({
      where: { contest_id: contestId, participant_id: participation.id, problem_id: problemId }
    }) + 1
  });
  
  // Update participation if accepted
  if (isAccepted) {
    const solvedCount = await ContestSubmission.count({
      where: { contest_id: contestId, participant_id: participation.id, is_accepted: true }
    });

    const totalScore = await ContestSubmission.sum('score', {
      where: { contest_id: contestId, participant_id: participation.id }
    });

    const totalPenalty = await ContestSubmission.sum('penalty', {
      where: { contest_id: contestId, participant_id: participation.id }
    });

    const problemsAttempted = await ContestSubmission.count({
      where: { contest_id: contestId, participant_id: participation.id },
      distinct: true,
      col: 'problem_id'
    });

    await participation.update({
      score: totalScore || 0,
      problems_solved: solvedCount || 0,
      problems_attempted: problemsAttempted || 0,
      total_time: timeFromStart,
      penalty: totalPenalty || 0
    });
  }

  // Always update leaderboard so partial testcase scores are reflected.
  const refreshedParticipation = await ContestParticipant.findByPk(participation.id);
  await updateLeaderboard(contestId, refreshedParticipation);
  
  res.json({
    submission,
    contestSubmission,
    isAccepted,
    testcaseScore
  });
});

// Update leaderboard
async function updateLeaderboard(contestId, participation) {
  const leaderboardKey = `contest:${contestId}:leaderboard`;
  const participants = await ContestParticipant.findAll({
    where: { contest_id: contestId },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'avatar']
    }],
    order: [
      ['score', 'DESC'],
      ['problems_solved', 'DESC'],
      ['total_time', 'ASC'],
      ['penalty', 'ASC']
    ]
  });

  for (let index = 0; index < participants.length; index += 1) {
    const participant = participants[index];
    const nextRank = index + 1;
    if (participant.rank !== nextRank) {
      await participant.update({ rank: nextRank });
    }
  }

  const leaderboardData = participants.map((participant, index) => ({
    rank: index + 1,
    userId: participant.user_id,
    username: participant.user?.username,
    avatar: participant.user?.avatar,
    score: participant.score || 0,
    problemsSolved: participant.problems_solved || 0,
    problemsAttempted: participant.problems_attempted || 0,
    totalTime: participant.total_time || 0,
    penalty: participant.penalty || 0,
    status: participant.status
  }));

  for (const entry of leaderboardData) {
    const weighted = (entry.score * 1000000) - ((entry.totalTime || 0) + (entry.penalty || 0));
    await cacheService.addToLeaderboard(leaderboardKey, entry.userId, weighted);
  }

  const io = getSocketIO();
  if (io) {
    io.to(`contest:${contestId}`).emit('contest:leaderboard:update', {
      leaderboard: leaderboardData
    });
  }
}

// Get contest leaderboard
export const getContestLeaderboard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contest = await Contest.findByPk(id);
  if (!contest) {
    throw new NotFoundError('Contest');
  }

  await updateLeaderboard(id);
  const participants = await ContestParticipant.findAll({
    where: { contest_id: id },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'avatar']
    }],
    order: [
      ['rank', 'ASC'],
      ['score', 'DESC'],
      ['problems_solved', 'DESC'],
      ['total_time', 'ASC'],
      ['penalty', 'ASC']
    ]
  });

  const leaderboardData = participants.map((participant, index) => ({
    rank: participant.rank || index + 1,
    userId: participant.user_id,
    username: participant.user?.username,
    avatar: participant.user?.avatar,
    score: participant.score || 0,
    problemsSolved: participant.problems_solved || 0,
    problemsAttempted: participant.problems_attempted || 0,
    totalTime: participant.total_time || 0,
    penalty: participant.penalty || 0,
    status: participant.status
  }));

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

export const getContestParticipants = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contest = await Contest.findByPk(id);
  if (!contest) {
    throw new NotFoundError('Contest');
  }

  const isAdmin = req.dbUser.role === 'admin';
  if (!isAdmin && contest.created_by !== req.dbUser.id) {
    throw new ForbiddenError('You can only view participants for your own contests');
  }

  const participants = await ContestParticipant.findAll({
    where: { contest_id: id },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'email', 'avatar']
    }],
    order: [
      ['rank', 'ASC'],
      ['score', 'DESC'],
      ['problems_solved', 'DESC'],
      ['total_time', 'ASC']
    ]
  });

  res.json({
    participants: participants.map((participant) => ({
      id: participant.id,
      user_id: participant.user_id,
      username: participant.user?.username,
      email: participant.user?.email,
      avatar: participant.user?.avatar,
      score: participant.score || 0,
      rank: participant.rank || null,
      problems_solved: participant.problems_solved || 0,
      problems_attempted: participant.problems_attempted || 0,
      total_time: participant.total_time || 0,
      penalty: participant.penalty || 0,
      status: participant.status,
      joined_at: participant.joined_at
    }))
  });
});

export const getMyContests = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const role = req.dbUser.role;
  const whereClause = role === 'learner' ? {} : { created_by: userId };

  const contests = await Contest.findAll({
    where: whereClause,
    include: [{
      model: User,
      as: 'creator',
      attributes: ['id', 'username', 'avatar']
    }],
    order: [['start_time', 'DESC']]
  });

  for (const contest of contests) {
    await normalizeContestStatus(contest);
  }

  res.json({
    contests: contests.map((contest) => attachContestTiming(contest))
  });
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
  getContestSubmissions,
  getContestParticipants,
  getMyContests
};

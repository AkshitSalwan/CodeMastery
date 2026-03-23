import { Problem, Submission, Topic } from '../models/index.js';
import { asyncHandler, NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import judge0Service from '../services/judge0Service.js';
import geminiService from '../services/geminiService.js';
import { cacheService } from '../config/redis.js';
import { Op } from 'sequelize';

// Get all problems
export const getAllProblems = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, difficulty, topic, status, search } = req.query;
  const userId = req.dbUser?.id;
  
  const whereClause = { status: 'published' };
  if (difficulty) whereClause.difficulty = difficulty;
  if (topic) whereClause.topic_id = topic;
  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }
  
  const { count, rows: problems } = await Problem.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    order: [['created_at', 'DESC']],
    include: [{
      model: Topic,
      as: 'topic',
      attributes: ['id', 'name', 'slug']
    }]
  });
  
  // Get user's submission status for each problem
  let problemStatus = {};
  if (userId) {
    const submissions = await Submission.findAll({
      where: { user_id: userId },
      attributes: ['problem_id', 'verdict']
    });
    
    submissions.forEach(s => {
      if (!problemStatus[s.problem_id] || s.verdict === 'accepted') {
        problemStatus[s.problem_id] = s.verdict;
      }
    });
  }
  
  const problemsWithStatus = problems.map(p => ({
    ...p.toJSON(),
    userStatus: problemStatus[p.id] || 'not_attempted'
  }));
  
  res.json({
    problems: problemsWithStatus,
    pagination: {
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit))
    }
  });
});

// Get problem by slug
export const getProblemBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.dbUser?.id;
  
  const problem = await Problem.findOne({
    where: { slug, status: 'published' },
    include: [{
      model: Topic,
      as: 'topic',
      attributes: ['id', 'name', 'slug']
    }]
  });
  
  if (!problem) {
    throw new NotFoundError('Problem');
  }
  
  // Increment views
  await problem.increment('views');
  
  // Get user's submissions for this problem
  let userSubmissions = [];
  if (userId) {
    userSubmissions = await Submission.findAll({
      where: { user_id: userId, problem_id: problem.id },
      order: [['submitted_at', 'DESC']],
      limit: 10
    });
  }
  
  // Don't send hidden test cases to client
  const problemData = problem.toJSON();
  delete problemData.hidden_test_cases;
  
  res.json({
    problem: problemData,
    userSubmissions
  });
});

// Create problem (Admin/Interviewer)
export const createProblem = asyncHandler(async (req, res) => {
  const {
    title, slug, description, difficulty, tags, topic_id,
    constraints, examples, test_cases, hidden_test_cases,
    starter_code, time_limit, memory_limit, points, hints, solution
  } = req.body;
  const userId = req.dbUser.id;
  
  // Check if slug exists
  const existingProblem = await Problem.findOne({ where: { slug } });
  if (existingProblem) {
    throw new ValidationError('Problem with this slug already exists');
  }
  
  const problem = await Problem.create({
    title,
    slug,
    description,
    difficulty,
    tags,
    topic_id,
    constraints,
    examples,
    test_cases,
    hidden_test_cases,
    starter_code,
    time_limit: time_limit || 2000,
    memory_limit: memory_limit || 256,
    points: points || 100,
    hints,
    solution,
    created_by: userId,
    status: 'published'
  });
  
  res.status(201).json({
    message: 'Problem created successfully',
    problem
  });
});

// Update problem
export const updateProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const problem = await Problem.findByPk(id);
  if (!problem) {
    throw new NotFoundError('Problem');
  }
  
  await problem.update(updates);
  
  res.json({
    message: 'Problem updated successfully',
    problem
  });
});

// Delete problem
export const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const problem = await Problem.findByPk(id);
  if (!problem) {
    throw new NotFoundError('Problem');
  }
  
  await problem.destroy();
  
  res.json({ message: 'Problem deleted successfully' });
});

// Submit solution
export const submitSolution = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { problem_id, code, language } = req.body;
  
  const problem = await Problem.findByPk(problem_id);
  if (!problem) {
    throw new NotFoundError('Problem');
  }
  
  const languageId = judge0Service.getLanguageId(language);
  if (!languageId) {
    throw new ValidationError('Unsupported language');
  }
  
  // Create submission record
  const submission = await Submission.create({
    user_id: userId,
    problem_id,
    code,
    language,
    language_id: languageId,
    verdict: 'pending',
    status: 'processing'
  });
  
  // Run against test cases
  const allTestCases = [
    ...(problem.test_cases || []),
    ...(problem.hidden_test_cases || [])
  ];
  
  const results = [];
  let passedCount = 0;
  let totalRuntime = 0;
  let totalMemory = 0;
  
  for (const testCase of allTestCases) {
    const result = await judge0Service.executeCode(code, language, testCase.input);
    
    const passed = result.stdout?.trim() === testCase.output?.trim();
    if (passed) passedCount++;
    
    results.push({
      input: testCase.input,
      expectedOutput: testCase.output,
      actualOutput: result.stdout || '',
      passed,
      runtime: result.time,
      memory: result.memory,
      error: result.stderr || result.compile_output || result.error
    });
    
    if (result.time) totalRuntime = Math.max(totalRuntime, result.time);
    if (result.memory) totalMemory = Math.max(totalMemory, result.memory);
    
    // Stop on first error for compilation errors
    if (result.statusId === 6) { // Compilation error
      break;
    }
  }
  
  // Determine verdict
  let verdict;
  if (passedCount === allTestCases.length) {
    verdict = 'accepted';
  } else if (results.some(r => r.error?.includes('Time Limit'))) {
    verdict = 'time_limit_exceeded';
  } else if (results.some(r => r.error?.includes('Memory'))) {
    verdict = 'memory_limit_exceeded';
  } else if (results.some(r => r.error?.includes('Runtime'))) {
    verdict = 'runtime_error';
  } else if (results[0]?.error?.includes('Compilation')) {
    verdict = 'compilation_error';
  } else {
    verdict = 'wrong_answer';
  }
  
  // Update submission
  await submission.update({
    verdict,
    status: 'completed',
    runtime: totalRuntime,
    memory: totalMemory,
    passed_tests: passedCount,
    total_tests: allTestCases.length,
    test_results: results.slice(0, problem.test_cases?.length || 0), // Only visible test cases
    output: results[0]?.actualOutput,
    error_output: results.find(r => r.error)?.error,
    compile_output: results.find(r => r.error?.includes('Compilation'))?.error
  });
  
  // Update problem stats
  await problem.increment('submissions_count');
  if (verdict === 'accepted') {
    await problem.increment('accepted_count');
    // Update acceptance rate
    const updatedProblem = await Problem.findByPk(problem_id);
    const rate = (updatedProblem.accepted_count / updatedProblem.submissions_count) * 100;
    await updatedProblem.update({ acceptance_rate: rate.toFixed(2) });
  }
  
  res.json({
    submission: {
      id: submission.id,
      verdict,
      runtime: totalRuntime,
      memory: totalMemory,
      passed_tests: passedCount,
      total_tests: allTestCases.length,
      test_results: results.slice(0, problem.test_cases?.length || 0)
    }
  });
});

// Run code (without submitting)
export const runCode = asyncHandler(async (req, res) => {
  const { code, language, testCases } = req.body;
  
  const languageId = judge0Service.getLanguageId(language);
  if (!languageId) {
    throw new ValidationError('Unsupported language');
  }
  
  const results = [];
  
  for (const testCase of testCases || []) {
    const result = await judge0Service.executeCode(code, language, testCase.input);
    
    results.push({
      input: testCase.input,
      expectedOutput: testCase.output,
      actualOutput: result.stdout || '',
      passed: result.stdout?.trim() === testCase.output?.trim(),
      runtime: result.time,
      memory: result.memory,
      error: result.stderr || result.compile_output || result.error
    });
  }
  
  res.json({ results });
});

// Get submission by ID
export const getSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.dbUser.id;
  
  const submission = await Submission.findByPk(id, {
    include: [{
      model: Problem,
      as: 'problem',
      attributes: ['id', 'title', 'slug']
    }]
  });
  
  if (!submission) {
    throw new NotFoundError('Submission');
  }
  
  // Check ownership
  if (submission.user_id !== userId && req.dbUser.role === 'learner') {
    throw new ValidationError('Not authorized to view this submission');
  }
  
  res.json({ submission });
});

// Get user submissions
export const getUserSubmissions = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { page = 1, limit = 20, problem_id, verdict } = req.query;
  
  const whereClause = { user_id: userId };
  if (problem_id) whereClause.problem_id = problem_id;
  if (verdict) whereClause.verdict = verdict;
  
  const { count, rows: submissions } = await Submission.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    order: [['submitted_at', 'DESC']],
    include: [{
      model: Problem,
      as: 'problem',
      attributes: ['id', 'title', 'slug', 'difficulty']
    }]
  });
  
  res.json({
    submissions,
    pagination: {
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit))
    }
  });
});

// Get AI hints for problem
export const getProblemHints = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  
  const problem = await Problem.findByPk(problemId);
  if (!problem) {
    throw new NotFoundError('Problem');
  }
  
  // If hints already exist, return them
  if (problem.hints && problem.hints.length > 0) {
    return res.json({ hints: problem.hints });
  }
  
  // Generate hints using Gemini
  const result = await geminiService.generateHints(
    problem.title,
    problem.description,
    problem.difficulty
  );
  
  if (!result.success) {
    throw new ValidationError('Failed to generate hints');
  }
  
  res.json({ hints: result.text });
});

// Get AI explanation for code
export const explainCode = asyncHandler(async (req, res) => {
  const { code, language } = req.body;
  
  const result = await geminiService.explainCode(code, language);
  
  if (!result.success) {
    throw new ValidationError('Failed to explain code');
  }
  
  res.json({ explanation: result.text });
});

export default {
  getAllProblems,
  getProblemBySlug,
  createProblem,
  updateProblem,
  deleteProblem,
  submitSolution,
  runCode,
  getSubmission,
  getUserSubmissions,
  getProblemHints,
  explainCode
};

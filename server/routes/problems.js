import { Router } from 'express';
import * as problemController from '../controllers/problemController.js';
import * as aiGenerationController from '../controllers/aiGenerationController.js';
import { requireAuth, getOrCreateUser, optionalAuth } from '../middleware/auth.js';
import { adminOnly, interviewerOrAdmin } from '../middleware/rbac.js';
import { validators, validate } from '../middleware/validate.js';

const router = Router();

// === NON-PARAMETERIZED ROUTES (evaluated first) ===

// GET all problems
router.get('/', optionalAuth, problemController.getAllProblems);

// POST to create new problem
router.post('/', requireAuth, getOrCreateUser, interviewerOrAdmin, validators.createProblem, validate, problemController.createProblem);

// AI Generation routes (POST endpoints - specific paths)
router.post('/generate-test-cases', requireAuth, getOrCreateUser, interviewerOrAdmin, aiGenerationController.generateTestCases);
router.post('/generate-hints', requireAuth, getOrCreateUser, interviewerOrAdmin, aiGenerationController.generateHints);
router.post('/generate-solution', requireAuth, getOrCreateUser, interviewerOrAdmin, aiGenerationController.generateSolutionExplanation);
router.post('/generate-starter-code', requireAuth, getOrCreateUser, interviewerOrAdmin, aiGenerationController.generateStarterCode);

// User submissions
router.get('/user/submissions', requireAuth, getOrCreateUser, problemController.getUserSubmissions);

// Submit and run code
router.post('/submit', requireAuth, getOrCreateUser, validators.submitCode, validate, problemController.submitSolution);
router.post('/run', requireAuth, getOrCreateUser, problemController.runCode);
router.post('/explain', requireAuth, getOrCreateUser, problemController.explainCode);
router.post('/analyze-solution', requireAuth, getOrCreateUser, problemController.analyzeSolution);

// === PARAMETERIZED ROUTES (evaluated after non-parameterized) ===

// Get submission by ID
router.get('/submissions/:id', requireAuth, getOrCreateUser, problemController.getSubmission);

// Get problem hints
router.get('/:problemId/hints', requireAuth, getOrCreateUser, problemController.getProblemHints);

// Update problem
router.put('/:id', requireAuth, getOrCreateUser, interviewerOrAdmin, problemController.updateProblem);

// Delete problem
router.delete('/:id', requireAuth, getOrCreateUser, adminOnly, problemController.deleteProblem);

// Get problem by slug (must be last since it's too generic)
router.get('/:slug', optionalAuth, problemController.getProblemBySlug);

export default router;

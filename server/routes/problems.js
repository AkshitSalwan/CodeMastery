import { Router } from 'express';
import * as problemController from '../controllers/problemController.js';
import { requireAuth, getOrCreateUser, optionalAuth } from '../middleware/auth.js';
import { adminOnly, interviewerOrAdmin } from '../middleware/rbac.js';
import { validators, validate } from '../middleware/validate.js';

const router = Router();

// Public routes
router.get('/', optionalAuth, problemController.getAllProblems);
router.get('/:slug', optionalAuth, problemController.getProblemBySlug);

// Protected routes
router.get('/submissions/:id', requireAuth, getOrCreateUser, problemController.getSubmission);
router.get('/user/submissions', requireAuth, getOrCreateUser, problemController.getUserSubmissions);
router.post('/submit', requireAuth, getOrCreateUser, validators.submitCode, validate, problemController.submitSolution);
router.post('/run', requireAuth, getOrCreateUser, problemController.runCode);
router.get('/:problemId/hints', requireAuth, getOrCreateUser, problemController.getProblemHints);
router.post('/explain', requireAuth, getOrCreateUser, problemController.explainCode);

// Admin/Interviewer routes
router.post('/', requireAuth, getOrCreateUser, interviewerOrAdmin, validators.createProblem, validate, problemController.createProblem);
router.put('/:id', requireAuth, getOrCreateUser, interviewerOrAdmin, problemController.updateProblem);
router.delete('/:id', requireAuth, getOrCreateUser, adminOnly, problemController.deleteProblem);

export default router;

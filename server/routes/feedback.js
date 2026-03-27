import { Router } from 'express';
import * as feedbackController from '../controllers/feedbackController.js';
import { requireAuth, getOrCreateUser } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/all', feedbackController.getAllFeedback);

// Protected routes
router.use(requireAuth, getOrCreateUser);

// Get user's feedback
router.get('/user', feedbackController.getUserFeedback);

// Create feedback
router.post('/create', feedbackController.createFeedback);

// Admin routes
router.get('/stats', feedbackController.getFeedbackStats);

export default router;

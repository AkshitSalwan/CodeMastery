import { Router } from 'express';
import * as dppController from '../controllers/dppController.js';
import { requireAuth, getOrCreateUser, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/leaderboard', optionalAuth, dppController.getDPPLeaderboard);

// Protected routes
router.get('/today', requireAuth, getOrCreateUser, dppController.getTodayDPP);
router.post('/update', requireAuth, getOrCreateUser, dppController.updateDPPProgress);
router.get('/streak', requireAuth, getOrCreateUser, dppController.getDPPStreak);
router.get('/history', requireAuth, getOrCreateUser, dppController.getDPPHistory);

export default router;

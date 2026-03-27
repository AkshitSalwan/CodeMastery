import { Router } from 'express';
import * as badgeController from '../controllers/badgeController.js';
import { requireAuth, getOrCreateUser } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/all', badgeController.getAllBadges);

// Protected routes
router.use(requireAuth, getOrCreateUser);

// Get current user's badges
router.get('/user', async (req, res) => {
  try {
    const userId = req.dbUser.id;
    // Create a modified request object with userId param
    const modifiedReq = { ...req, params: { userId } };
    return badgeController.getUserBadges(modifiedReq, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific user's badges (by userId param)
router.get('/user/:userId', badgeController.getUserBadges);

// Admin routes
router.post('/create', badgeController.createBadge);
router.post('/award', badgeController.awardBadge);

export default router;

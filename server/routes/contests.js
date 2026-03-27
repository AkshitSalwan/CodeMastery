import { Router } from 'express';
import * as contestController from '../controllers/contestController.js';
import { requireAuth, getOrCreateUser, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Public listing/details
router.get('/', optionalAuth, contestController.getAllContests);
router.get('/mine', requireAuth, getOrCreateUser, contestController.getMyContests);
router.get('/:id', optionalAuth, contestController.getContestById);
router.get('/:id/leaderboard', optionalAuth, contestController.getContestLeaderboard);

// Interviewer/Admin contest management
router.post('/', requireAuth, getOrCreateUser, contestController.createContest);
router.put('/:id', requireAuth, getOrCreateUser, contestController.updateContest);
router.delete('/:id', requireAuth, getOrCreateUser, contestController.deleteContest);
router.get('/:id/participants', requireAuth, getOrCreateUser, contestController.getContestParticipants);

// Learner lifecycle
router.post('/:id/register', requireAuth, getOrCreateUser, contestController.registerForContest);
router.post('/:id/join', requireAuth, getOrCreateUser, contestController.joinContest);
router.get('/:contestId/submissions', requireAuth, getOrCreateUser, contestController.getContestSubmissions);
router.post('/:contestId/problems/:problemId/submit', requireAuth, getOrCreateUser, contestController.submitContestSolution);

export default router;

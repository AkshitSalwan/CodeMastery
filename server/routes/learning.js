import { Router } from 'express';
import * as learningController from '../controllers/learningController.js';
import { requireAuth, getOrCreateUser } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(requireAuth, getOrCreateUser);

router.get('/progress', learningController.getLearningProgress);
router.get('/dashboard', learningController.getLearningDashboard);
router.get('/schedule', learningController.getLearningSchedule);
router.get('/revisions', learningController.getDueRevisions);

router.post('/start/:topicId', learningController.startTopic);
router.put('/progress/:topicId', learningController.updateProgress);
router.post('/complete/:topicId', learningController.completeTopic);
router.post('/revise/:topicId', learningController.completeRevision);

export default router;

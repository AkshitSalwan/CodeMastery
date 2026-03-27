import express from 'express';
import {
  getFeaturedTopics,
  getMeta,
  getTopicAssessment,
  getTopicAssessmentFeedback,
  getTopicBySlug,
  getTopicVideos,
  getTopics,
} from '../controllers/learnersPlatformController.js';

const router = express.Router();

router.get('/meta', getMeta);
router.get('/topics', getTopics);
router.get('/topics/featured', getFeaturedTopics);
router.post('/topics/:slug/assessment', getTopicAssessment);
router.post('/topics/:slug/assessment/feedback', getTopicAssessmentFeedback);
router.get('/topics/:slug/videos', getTopicVideos);
router.get('/topics/:slug', getTopicBySlug);

export default router;

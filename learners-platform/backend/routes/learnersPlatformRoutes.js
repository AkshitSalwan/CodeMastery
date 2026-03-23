const express = require('express');
const {
  getFeaturedTopics,
  getMeta,
  getTopicAssessment,
  getTopicBySlug,
  getTopicVideos,
  getTopics,
} = require('../controllers/learnersPlatformController');

const router = express.Router();

router.get('/meta', getMeta);
router.get('/topics', getTopics);
router.get('/topics/featured', getFeaturedTopics);
router.post('/topics/:slug/assessment', getTopicAssessment);
router.get('/topics/:slug/videos', getTopicVideos);
router.get('/topics/:slug', getTopicBySlug);

module.exports = router;

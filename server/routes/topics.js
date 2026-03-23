import { Router } from 'express';
import * as topicController from '../controllers/topicController.js';
import { requireAuth, getOrCreateUser, optionalAuth } from '../middleware/auth.js';
import { adminOnly } from '../middleware/rbac.js';
import { validators, validate } from '../middleware/validate.js';

const router = Router();

// Public routes
router.get('/', optionalAuth, topicController.getAllTopics);
router.get('/:slug', optionalAuth, topicController.getTopicBySlug);
router.get('/:topicId/resources', topicController.getTopicResources);

// Admin routes
router.post('/', requireAuth, getOrCreateUser, adminOnly, validators.createTopic, validate, topicController.createTopic);
router.put('/:id', requireAuth, getOrCreateUser, adminOnly, topicController.updateTopic);
router.delete('/:id', requireAuth, getOrCreateUser, adminOnly, topicController.deleteTopic);
router.post('/:topicId/resources', requireAuth, getOrCreateUser, topicController.addResource);
router.put('/resources/:resourceId', requireAuth, getOrCreateUser, topicController.updateResource);
router.delete('/resources/:resourceId', requireAuth, getOrCreateUser, topicController.deleteResource);

export default router;

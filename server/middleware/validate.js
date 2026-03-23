import { body, param, query, validationResult } from 'express-validator';
import { ValidationError } from './errorHandler.js';

// Validation result handler
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));
    throw new ValidationError('Validation failed', formattedErrors);
  }
  next();
};

// Common validation rules
export const validators = {
  // ID validation
  mongoId: (field = 'id') => param(field).isInt().withMessage('Invalid ID'),
  
  // Pagination
  pagination: [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('sort').optional().isString().trim(),
    query('order').optional().isIn(['asc', 'desc'])
  ],

  // User validation
  updateUser: [
    body('username').optional().isLength({ min: 3, max: 50 }).trim(),
    body('bio').optional().isLength({ max: 500 }).trim(),
    body('github_url').optional().isURL(),
    body('linkedin_url').optional().isURL()
  ],

  // Topic validation
  createTopic: [
    body('name').isLength({ min: 2, max: 100 }).trim(),
    body('slug').isLength({ min: 2, max: 100 }).trim().isSlug(),
    body('description').optional().isLength({ max: 2000 }),
    body('difficulty').isIn(['beginner', 'intermediate', 'advanced']),
    body('estimated_time').optional().isInt({ min: 1 }),
    body('tags').optional().isArray()
  ],

  updateTopic: [
    param('id').isInt(),
    body('name').optional().isLength({ min: 2, max: 100 }).trim(),
    body('description').optional().isLength({ max: 2000 }),
    body('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced'])
  ],

  // Problem validation
  createProblem: [
    body('title').isLength({ min: 5, max: 255 }).trim(),
    body('slug').isLength({ min: 5, max: 255 }).trim().isSlug(),
    body('description').isLength({ min: 10 }),
    body('difficulty').isIn(['easy', 'medium', 'hard']),
    body('tags').optional().isArray(),
    body('test_cases').optional().isArray(),
    body('hidden_test_cases').optional().isArray(),
    body('time_limit').optional().isInt({ min: 100, max: 30000 }),
    body('memory_limit').optional().isInt({ min: 16, max: 1024 })
  ],

  // Submission validation
  submitCode: [
    body('problem_id').isInt(),
    body('code').isLength({ min: 1, max: 50000 }),
    body('language').isIn(['javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust', 'typescript'])
  ],

  // Contest validation
  createContest: [
    body('title').isLength({ min: 5, max: 255 }).trim(),
    body('slug').isLength({ min: 5, max: 255 }).trim().isSlug(),
    body('description').optional().isLength({ max: 5000 }),
    body('start_time').isISO8601(),
    body('end_time').isISO8601(),
    body('problems').isArray({ min: 1 }),
    body('visibility').optional().isIn(['public', 'private', 'invite_only'])
  ],

  // Discussion validation
  createDiscussion: [
    body('title').isLength({ min: 5, max: 255 }).trim(),
    body('content').isLength({ min: 10, max: 10000 }),
    body('topic_id').optional().isInt(),
    body('problem_id').optional().isInt(),
    body('tags').optional().isArray({ max: 5 })
  ],

  createComment: [
    body('content').isLength({ min: 1, max: 5000 }),
    body('discussion_id').isInt(),
    body('parent_id').optional().isInt()
  ],

  // Feedback validation
  createFeedback: [
    body('type').isIn(['topic', 'problem', 'platform', 'feature', 'bug', 'other']),
    body('subject').isLength({ min: 5, max: 255 }).trim(),
    body('message').isLength({ min: 10, max: 5000 }),
    body('rating').optional().isInt({ min: 1, max: 5 })
  ],

  // Bookmark validation
  createBookmark: [
    body('resource_type').isIn(['topic', 'resource', 'problem', 'discussion']),
    body('resource_id').isInt()
  ],

  // Resource validation
  createResource: [
    body('topic_id').isInt(),
    body('type').isIn(['video', 'article', 'documentation', 'tutorial', 'course']),
    body('title').isLength({ min: 2, max: 255 }).trim(),
    body('url').isURL(),
    body('difficulty').isIn(['beginner', 'intermediate', 'advanced'])
  ]
};

export default validators;

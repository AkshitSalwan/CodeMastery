import { Bookmark, Topic, Resource, Problem, Discussion } from '../models/index.js';
import { asyncHandler, NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';

// Get all user bookmarks
export const getBookmarks = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { type, page = 1, limit = 20 } = req.query;
  
  const whereClause = { user_id: userId };
  if (type) whereClause.resource_type = type;
  
  const { count, rows: bookmarks } = await Bookmark.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    order: [['created_at', 'DESC']]
  });
  
  // Enrich bookmarks with resource details
  const enrichedBookmarks = await Promise.all(bookmarks.map(async (bookmark) => {
    let resource = null;
    
    switch (bookmark.resource_type) {
      case 'topic':
        resource = await Topic.findByPk(bookmark.resource_id, {
          attributes: ['id', 'name', 'slug', 'difficulty', 'icon', 'color']
        });
        break;
      case 'resource':
        resource = await Resource.findByPk(bookmark.resource_id, {
          attributes: ['id', 'title', 'type', 'url', 'thumbnail'],
          include: [{ model: Topic, as: 'topic', attributes: ['id', 'name'] }]
        });
        break;
      case 'problem':
        resource = await Problem.findByPk(bookmark.resource_id, {
          attributes: ['id', 'title', 'slug', 'difficulty', 'points']
        });
        break;
      case 'discussion':
        resource = await Discussion.findByPk(bookmark.resource_id, {
          attributes: ['id', 'title', 'created_at']
        });
        break;
    }
    
    return {
      ...bookmark.toJSON(),
      resource
    };
  }));
  
  res.json({
    bookmarks: enrichedBookmarks,
    pagination: {
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit))
    }
  });
});

// Add bookmark
export const addBookmark = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { resource_type, resource_id, notes } = req.body;
  
  // Check if resource exists
  let resourceExists = false;
  switch (resource_type) {
    case 'topic':
      resourceExists = !!(await Topic.findByPk(resource_id));
      break;
    case 'resource':
      resourceExists = !!(await Resource.findByPk(resource_id));
      break;
    case 'problem':
      resourceExists = !!(await Problem.findByPk(resource_id));
      break;
    case 'discussion':
      resourceExists = !!(await Discussion.findByPk(resource_id));
      break;
    default:
      throw new ValidationError('Invalid resource type');
  }
  
  if (!resourceExists) {
    throw new NotFoundError('Resource');
  }
  
  // Check if already bookmarked
  const existing = await Bookmark.findOne({
    where: { user_id: userId, resource_type, resource_id }
  });
  
  if (existing) {
    return res.json({ message: 'Already bookmarked', bookmark: existing });
  }
  
  const bookmark = await Bookmark.create({
    user_id: userId,
    resource_type,
    resource_id,
    notes
  });
  
  res.status(201).json({
    message: 'Bookmark added successfully',
    bookmark
  });
});

// Remove bookmark
export const removeBookmark = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { id } = req.params;
  
  const bookmark = await Bookmark.findOne({
    where: { id, user_id: userId }
  });
  
  if (!bookmark) {
    throw new NotFoundError('Bookmark');
  }
  
  await bookmark.destroy();
  
  res.json({ message: 'Bookmark removed successfully' });
});

// Remove bookmark by resource
export const removeBookmarkByResource = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { resource_type, resource_id } = req.body;
  
  await Bookmark.destroy({
    where: { user_id: userId, resource_type, resource_id }
  });
  
  res.json({ message: 'Bookmark removed successfully' });
});

// Check if bookmarked
export const checkBookmarked = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { resource_type, resource_id } = req.query;
  
  const bookmark = await Bookmark.findOne({
    where: { user_id: userId, resource_type, resource_id }
  });
  
  res.json({ isBookmarked: !!bookmark, bookmark });
});

export default {
  getBookmarks,
  addBookmark,
  removeBookmark,
  removeBookmarkByResource,
  checkBookmarked
};

import { Discussion, Comment, User, Topic, Problem } from '../models/index.js';
import { asyncHandler, NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';
import { getSocketIO } from '../socket/index.js';

// Get all discussions
export const getAllDiscussions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, topic_id, problem_id, search, sort = 'recent' } = req.query;
  
  const whereClause = {};
  if (topic_id) whereClause.topic_id = topic_id;
  if (problem_id) whereClause.problem_id = problem_id;
  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { content: { [Op.like]: `%${search}%` } }
    ];
  }
  
  let order = [['created_at', 'DESC']];
  if (sort === 'popular') order = [['upvotes', 'DESC']];
  if (sort === 'comments') order = [['comment_count', 'DESC']];
  
  const { count, rows: discussions } = await Discussion.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    order,
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      },
      {
        model: Topic,
        as: 'topic',
        attributes: ['id', 'name', 'slug']
      },
      {
        model: Problem,
        as: 'problem',
        attributes: ['id', 'title', 'slug']
      }
    ]
  });
  
  res.json({
    discussions,
    pagination: {
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit))
    }
  });
});

// Get discussion by ID
export const getDiscussionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const discussion = await Discussion.findByPk(id, {
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      },
      {
        model: Topic,
        as: 'topic',
        attributes: ['id', 'name', 'slug']
      },
      {
        model: Problem,
        as: 'problem',
        attributes: ['id', 'title', 'slug']
      }
    ]
  });
  
  if (!discussion) {
    throw new NotFoundError('Discussion');
  }
  
  // Increment views
  await discussion.increment('views');
  
  // Get comments
  const comments = await Comment.findAll({
    where: { discussion_id: id },
    include: [{
      model: User,
      as: 'author',
      attributes: ['id', 'username', 'avatar']
    }],
    order: [['created_at', 'ASC']]
  });
  
  res.json({ discussion, comments });
});

// Create discussion
export const createDiscussion = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { title, content, topic_id, problem_id, tags } = req.body;
  
  const discussion = await Discussion.create({
    user_id: userId,
    title,
    content,
    topic_id,
    problem_id,
    tags
  });
  
  // Fetch with associations
  const fullDiscussion = await Discussion.findByPk(discussion.id, {
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }
    ]
  });
  
  // Emit socket event
  const io = getSocketIO();
  if (topic_id) {
    io.to(`topic:${topic_id}`).emit('discussion:new', fullDiscussion);
  }
  if (problem_id) {
    io.to(`problem:${problem_id}`).emit('discussion:new', fullDiscussion);
  }
  
  res.status(201).json({
    message: 'Discussion created successfully',
    discussion: fullDiscussion
  });
});

// Update discussion
export const updateDiscussion = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { id } = req.params;
  const updates = req.body;
  
  const discussion = await Discussion.findByPk(id);
  
  if (!discussion) {
    throw new NotFoundError('Discussion');
  }
  
  if (discussion.user_id !== userId) {
    throw new ValidationError('Not authorized to update this discussion');
  }
  
  await discussion.update(updates);
  
  res.json({
    message: 'Discussion updated successfully',
    discussion
  });
});

// Delete discussion
export const deleteDiscussion = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { id } = req.params;
  
  const discussion = await Discussion.findByPk(id);
  
  if (!discussion) {
    throw new NotFoundError('Discussion');
  }
  
  if (discussion.user_id !== userId && req.dbUser.role === 'learner') {
    throw new ValidationError('Not authorized to delete this discussion');
  }
  
  // Delete comments first
  await Comment.destroy({ where: { discussion_id: id } });
  await discussion.destroy();
  
  res.json({ message: 'Discussion deleted successfully' });
});

// Upvote/downvote discussion
export const voteDiscussion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { vote } = req.body; // 'up' or 'down'
  
  const discussion = await Discussion.findByPk(id);
  
  if (!discussion) {
    throw new NotFoundError('Discussion');
  }
  
  if (vote === 'up') {
    await discussion.increment('upvotes');
  } else if (vote === 'down') {
    await discussion.increment('downvotes');
  }
  
  await discussion.reload();
  
  res.json({
    message: 'Vote recorded',
    upvotes: discussion.upvotes,
    downvotes: discussion.downvotes
  });
});

// Add comment
export const addComment = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { discussionId } = req.params;
  const { content, parent_id } = req.body;
  
  const discussion = await Discussion.findByPk(discussionId);
  
  if (!discussion) {
    throw new NotFoundError('Discussion');
  }
  
  if (discussion.is_locked) {
    throw new ValidationError('Discussion is locked');
  }
  
  const comment = await Comment.create({
    discussion_id: discussionId,
    user_id: userId,
    content,
    parent_id
  });
  
  // Update comment count
  await discussion.increment('comment_count');
  
  // Fetch with author
  const fullComment = await Comment.findByPk(comment.id, {
    include: [{
      model: User,
      as: 'author',
      attributes: ['id', 'username', 'avatar']
    }]
  });
  
  // Emit socket event
  const io = getSocketIO();
  io.to(`discussion:${discussionId}`).emit('discussion:reply', fullComment);
  
  res.status(201).json({
    message: 'Comment added successfully',
    comment: fullComment
  });
});

// Update comment
export const updateComment = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { commentId } = req.params;
  const { content } = req.body;
  
  const comment = await Comment.findByPk(commentId);
  
  if (!comment) {
    throw new NotFoundError('Comment');
  }
  
  if (comment.user_id !== userId) {
    throw new ValidationError('Not authorized to update this comment');
  }
  
  await comment.update({
    content,
    is_edited: true,
    edited_at: new Date()
  });
  
  res.json({
    message: 'Comment updated successfully',
    comment
  });
});

// Delete comment
export const deleteComment = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { commentId } = req.params;
  
  const comment = await Comment.findByPk(commentId);
  
  if (!comment) {
    throw new NotFoundError('Comment');
  }
  
  if (comment.user_id !== userId && req.dbUser.role === 'learner') {
    throw new ValidationError('Not authorized to delete this comment');
  }
  
  const discussion = await Discussion.findByPk(comment.discussion_id);
  await comment.destroy();
  await discussion?.decrement('comment_count');
  
  res.json({ message: 'Comment deleted successfully' });
});

// Vote comment
export const voteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { vote } = req.body;
  
  const comment = await Comment.findByPk(commentId);
  
  if (!comment) {
    throw new NotFoundError('Comment');
  }
  
  if (vote === 'up') {
    await comment.increment('upvotes');
  } else if (vote === 'down') {
    await comment.increment('downvotes');
  }
  
  await comment.reload();
  
  res.json({
    message: 'Vote recorded',
    upvotes: comment.upvotes,
    downvotes: comment.downvotes
  });
});

// Mark answer as best
export const markBestAnswer = asyncHandler(async (req, res) => {
  const userId = req.dbUser.id;
  const { discussionId, commentId } = req.params;
  
  const discussion = await Discussion.findByPk(discussionId);
  
  if (!discussion) {
    throw new NotFoundError('Discussion');
  }
  
  if (discussion.user_id !== userId) {
    throw new ValidationError('Not authorized to mark best answer');
  }
  
  const comment = await Comment.findByPk(commentId);
  
  if (!comment || comment.discussion_id !== parseInt(discussionId)) {
    throw new NotFoundError('Comment');
  }
  
  // Unmark previous best answer
  await Comment.update(
    { is_best_answer: false },
    { where: { discussion_id: discussionId, is_best_answer: true } }
  );
  
  // Mark new best answer
  await comment.update({ is_best_answer: true, is_answer: true });
  await discussion.update({ best_answer_id: commentId, status: 'resolved' });
  
  res.json({
    message: 'Best answer marked',
    comment
  });
});

export default {
  getAllDiscussions,
  getDiscussionById,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  voteDiscussion,
  addComment,
  updateComment,
  deleteComment,
  voteComment,
  markBestAnswer
};

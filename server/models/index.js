import { sequelize } from '../config/database.js';
import User from './User.js';
import Topic from './Topic.js';
import Resource from './Resource.js';
import LearningProgress from './LearningProgress.js';
import Problem from './Problem.js';
import Submission from './Submission.js';
import Contest from './Contest.js';
import ContestParticipant from './ContestParticipant.js';
import ContestSubmission from './ContestSubmission.js';
import Bookmark from './Bookmark.js';
import Badge from './Badge.js';
import UserBadge from './UserBadge.js';
import Discussion from './Discussion.js';
import Comment from './Comment.js';
import Feedback from './Feedback.js';
import DailyProblem from './DailyProblem.js';
import UserDPPProgress from './UserDPPProgress.js';

// Define associations

// User associations
User.hasMany(LearningProgress, { foreignKey: 'user_id', as: 'learningProgress' });
User.hasMany(Submission, { foreignKey: 'user_id', as: 'submissions' });
User.hasMany(ContestParticipant, { foreignKey: 'user_id', as: 'contestParticipations' });
User.hasMany(Contest, { foreignKey: 'created_by', as: 'createdContests' });
User.hasMany(Bookmark, { foreignKey: 'user_id', as: 'bookmarks' });
User.belongsToMany(Badge, { through: UserBadge, foreignKey: 'user_id', as: 'badges' });
User.hasMany(Discussion, { foreignKey: 'user_id', as: 'discussions' });
User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
User.hasMany(Feedback, { foreignKey: 'user_id', as: 'feedback' });
User.hasMany(UserDPPProgress, { foreignKey: 'user_id', as: 'dppProgress' });

// Topic associations
Topic.hasMany(Resource, { foreignKey: 'topic_id', as: 'resources' });
Topic.hasMany(LearningProgress, { foreignKey: 'topic_id', as: 'learningProgress' });
Topic.hasMany(Problem, { foreignKey: 'topic_id', as: 'problems' });
Topic.hasMany(Discussion, { foreignKey: 'topic_id', as: 'discussions' });
Topic.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Resource associations
Resource.belongsTo(Topic, { foreignKey: 'topic_id', as: 'topic' });
Resource.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// LearningProgress associations
LearningProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
LearningProgress.belongsTo(Topic, { foreignKey: 'topic_id', as: 'topic' });

// Problem associations
Problem.belongsTo(Topic, { foreignKey: 'topic_id', as: 'topic' });
Problem.hasMany(Submission, { foreignKey: 'problem_id', as: 'submissions' });
Problem.hasMany(Discussion, { foreignKey: 'problem_id', as: 'discussions' });
Problem.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Submission associations
Submission.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Submission.belongsTo(Problem, { foreignKey: 'problem_id', as: 'problem' });
Submission.hasMany(ContestSubmission, { foreignKey: 'submission_id', as: 'contestSubmissions' });

// Contest associations
Contest.hasMany(ContestParticipant, { foreignKey: 'contest_id', as: 'participants' });
Contest.hasMany(ContestSubmission, { foreignKey: 'contest_id', as: 'submissions' });
Contest.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Contest.belongsToMany(Problem, { through: 'contest_problems', foreignKey: 'contest_id', as: 'contestProblems' });

// ContestParticipant associations
ContestParticipant.belongsTo(Contest, { foreignKey: 'contest_id', as: 'contest' });
ContestParticipant.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
ContestParticipant.hasMany(ContestSubmission, { foreignKey: 'participant_id', as: 'submissions' });

// ContestSubmission associations
ContestSubmission.belongsTo(Contest, { foreignKey: 'contest_id', as: 'contest' });
ContestSubmission.belongsTo(ContestParticipant, { foreignKey: 'participant_id', as: 'participant' });
ContestSubmission.belongsTo(Problem, { foreignKey: 'problem_id', as: 'problem' });
ContestSubmission.belongsTo(Submission, { foreignKey: 'submission_id', as: 'submission' });

// Bookmark associations
Bookmark.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Badge associations
Badge.belongsToMany(User, { through: UserBadge, foreignKey: 'badge_id', as: 'users' });
Badge.hasMany(UserBadge, { foreignKey: 'badge_id', as: 'userBadges' });

// UserBadge associations
UserBadge.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
UserBadge.belongsTo(Badge, { foreignKey: 'badge_id', as: 'badge' });

// Discussion associations
Discussion.belongsTo(User, { foreignKey: 'user_id', as: 'author' });
Discussion.belongsTo(Topic, { foreignKey: 'topic_id', as: 'topic' });
Discussion.belongsTo(Problem, { foreignKey: 'problem_id', as: 'problem' });
Discussion.hasMany(Comment, { foreignKey: 'discussion_id', as: 'comments' });

// Comment associations
Comment.belongsTo(Discussion, { foreignKey: 'discussion_id', as: 'discussion' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });
Comment.belongsTo(Comment, { foreignKey: 'parent_id', as: 'parent' });
Comment.hasMany(Comment, { foreignKey: 'parent_id', as: 'replies' });

// Feedback associations
Feedback.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Feedback.belongsTo(User, { foreignKey: 'responded_by', as: 'responder' });

// DailyProblem associations
DailyProblem.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// UserDPPProgress associations
UserDPPProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Sync database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Database sync error:', error.message);
    throw error;
  }
};

export {
  sequelize,
  syncDatabase,
  User,
  Topic,
  Resource,
  LearningProgress,
  Problem,
  Submission,
  Contest,
  ContestParticipant,
  ContestSubmission,
  Bookmark,
  Badge,
  UserBadge,
  Discussion,
  Comment,
  Feedback,
  DailyProblem,
  UserDPPProgress
};

export default {
  sequelize,
  syncDatabase,
  User,
  Topic,
  Resource,
  LearningProgress,
  Problem,
  Submission,
  Contest,
  ContestParticipant,
  ContestSubmission,
  Bookmark,
  Badge,
  UserBadge,
  Discussion,
  Comment,
  Feedback,
  DailyProblem,
  UserDPPProgress
};

import { sequelize } from '../config/database.js';
import User from './user.js';
import Problem from './Problem.js';
import Submission from './Submission.js';
import Topic from './Topic.js';
import Badge from './Badge.js';
import Resource from './Resource.js';
import DailyProblem from './DailyProblem.js';
import UserDPPProgress from './UserDPPProgress.js';
import LearningProgress from './LearningProgress.js';
import UserBadge from './UserBadge.js';
import Feedback from './Feedback.js';

// Define associations
UserBadge.belongsTo(Badge, {
  as: 'badge',
  foreignKey: 'badge_id'
});

Badge.hasMany(UserBadge, {
  as: 'userBadges',
  foreignKey: 'badge_id'
});

UserBadge.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id'
});

User.hasMany(UserBadge, {
  as: 'badges',
  foreignKey: 'user_id'
});

export {
  sequelize,
  User,
  Problem,
  Submission,
  Topic,
  Badge,
  Resource,
  DailyProblem,
  UserDPPProgress,
  LearningProgress,
  UserBadge,
  Feedback,
};

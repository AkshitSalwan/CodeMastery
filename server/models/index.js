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
import Contest from './Contest.js';
import ContestParticipant from './ContestParticipant.js';
import ContestSubmission from './ContestSubmission.js';

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

Contest.belongsTo(User, {
  as: 'creator',
  foreignKey: 'created_by'
});

User.hasMany(Contest, {
  as: 'createdContests',
  foreignKey: 'created_by'
});

ContestParticipant.belongsTo(Contest, {
  as: 'contest',
  foreignKey: 'contest_id'
});

Contest.hasMany(ContestParticipant, {
  as: 'participants',
  foreignKey: 'contest_id'
});

ContestParticipant.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id'
});

User.hasMany(ContestParticipant, {
  as: 'contestParticipations',
  foreignKey: 'user_id'
});

ContestSubmission.belongsTo(Contest, {
  as: 'contest',
  foreignKey: 'contest_id'
});

Contest.hasMany(ContestSubmission, {
  as: 'submissions',
  foreignKey: 'contest_id'
});

ContestSubmission.belongsTo(ContestParticipant, {
  as: 'participant',
  foreignKey: 'participant_id'
});

ContestParticipant.hasMany(ContestSubmission, {
  as: 'submissions',
  foreignKey: 'participant_id'
});

ContestSubmission.belongsTo(Problem, {
  as: 'problem',
  foreignKey: 'problem_id'
});

Problem.hasMany(ContestSubmission, {
  as: 'contestSubmissions',
  foreignKey: 'problem_id'
});

ContestSubmission.belongsTo(Submission, {
  as: 'submission',
  foreignKey: 'submission_id'
});

Submission.hasMany(ContestSubmission, {
  as: 'contestMappings',
  foreignKey: 'submission_id'
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
  Contest,
  ContestParticipant,
  ContestSubmission,
};

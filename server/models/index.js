import { sequelize } from '../config/database.js';
import User from './user.js';
import Problem from './Problem.js';
import Submission from './Submission.js';
import Topic from './Topic.js';
import Badge from './Badge.js';
import Resource from './Resource.js';
import DailyProblem from './DailyProblem.js';
import UserDPPProgress from './UserDPPProgress.js';

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
};

import { sequelize } from '../config/database.js';
import User from './user.js';
import Problem from './Problem.js';
import Submission from './Submission.js';
import Topic from './Topic.js';

// Note: Other models would be imported here similarly
// import Badge from './Badge.js';
// import Bookmark from './Bookmark.js';
// etc...

export { sequelize, User, Problem, Submission, Topic };

import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Problem = sequelize.define('Problem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    allowNull: false,
    defaultValue: 'easy'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON array of tags'
  },
  topic_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'topic_id',
    references: {
      model: 'topics',
      key: 'id'
    }
  },
  constraints: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  examples: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON array of example objects with input, output, explanation'
  },
  test_cases: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'test_cases',
    comment: 'JSON array of visible test cases'
  },
  hidden_test_cases: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'hidden_test_cases',
    comment: 'JSON array of hidden test cases for evaluation'
  },
  starter_code: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'starter_code',
    comment: 'JSON object with language as key and starter code as value'
  },
  time_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 2000,
    field: 'time_limit',
    comment: 'Time limit in milliseconds'
  },
  memory_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 256,
    field: 'memory_limit',
    comment: 'Memory limit in MB'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  acceptance_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    field: 'acceptance_rate'
  },
  submissions_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'submissions_count'
  },
  accepted_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'accepted_count'
  },
  hints: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON array of hints'
  },
  solution: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Solution explanation'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'published'
  },
  is_premium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_premium'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'problems',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Problem;

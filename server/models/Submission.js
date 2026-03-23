import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  problem_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'problem_id',
    references: {
      model: 'problems',
      key: 'id'
    }
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  language: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'e.g., javascript, python, java, cpp'
  },
  language_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'language_id',
    comment: 'Judge0 language ID'
  },
  verdict: {
    type: DataTypes.ENUM('pending', 'accepted', 'wrong_answer', 'time_limit_exceeded', 
                         'memory_limit_exceeded', 'runtime_error', 'compilation_error', 
                         'internal_error', 'partial'),
    defaultValue: 'pending'
  },
  runtime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Runtime in milliseconds'
  },
  memory: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Memory used in KB'
  },
  passed_tests: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'passed_tests'
  },
  total_tests: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_tests'
  },
  test_results: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'test_results',
    comment: 'JSON array of individual test case results'
  },
  output: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  error_output: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'error_output'
  },
  compile_output: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'compile_output'
  },
  judge0_token: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'judge0_token'
  },
  status: {
    type: DataTypes.ENUM('processing', 'completed', 'failed'),
    defaultValue: 'processing'
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'submitted_at'
  }
}, {
  tableName: 'submissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Submission;

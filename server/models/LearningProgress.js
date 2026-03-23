import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const LearningProgress = sequelize.define('LearningProgress', {
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
  topic_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'topic_id',
    references: {
      model: 'topics',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
    defaultValue: 'not_started'
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'started_at'
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at'
  },
  next_revision: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'next_revision'
  },
  revision_level: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'revision_level',
    comment: '0=not revised, 1=3 days, 2=7 days, 3=14 days, 4=mastered'
  },
  last_revision_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_revision_at'
  },
  time_spent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'time_spent',
    comment: 'Total time spent in minutes'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mastery_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'mastery_score',
    validate: {
      min: 0,
      max: 100
    }
  }
}, {
  tableName: 'learning_progress',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'topic_id']
    }
  ]
});

export default LearningProgress;

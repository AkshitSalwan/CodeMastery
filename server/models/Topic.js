import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Topic = sequelize.define('Topic', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false,
    defaultValue: 'beginner'
  },
  estimated_time: {
    type: DataTypes.INTEGER, // in hours
    allowNull: true,
    field: 'estimated_time'
  },
  roadmap: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON array of learning milestones'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON array of tags'
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    comment: 'Hex color code for UI'
  },
  prerequisites: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON array of prerequisite topic IDs'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'published'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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
  tableName: 'topics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Topic;

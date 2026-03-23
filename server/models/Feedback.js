import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Feedback = sequelize.define('Feedback', {
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
  type: {
    type: DataTypes.ENUM('topic', 'problem', 'platform', 'feature', 'bug', 'other'),
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  resource_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'resource_type'
  },
  resource_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'resource_id'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_review', 'resolved', 'dismissed'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  responded_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'responded_by',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  responded_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'responded_at'
  }
}, {
  tableName: 'feedback',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Feedback;

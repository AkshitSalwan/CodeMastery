import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Contest = sequelize.define('Contest', {
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
    allowNull: true
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_time'
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_time'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in minutes'
  },
  problems: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON array of problem IDs'
  },
  rules: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  scoring: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON object with scoring rules'
  },
  penalty: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    comment: 'Penalty in minutes for wrong submission'
  },
  max_participants: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'max_participants'
  },
  participants_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'participants_count'
  },
  visibility: {
    type: DataTypes.ENUM('public', 'private', 'invite_only'),
    defaultValue: 'public'
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
    defaultValue: 'upcoming'
  },
  contest_type: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'special', 'hiring'),
    defaultValue: 'special',
    field: 'contest_type'
  },
  prizes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON object with prize details'
  },
  banner_image: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'banner_image'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'contests',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Contest;

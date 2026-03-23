import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const UserBadge = sequelize.define('UserBadge', {
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
  badge_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'badge_id',
    references: {
      model: 'badges',
      key: 'id'
    }
  },
  earned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'earned_at'
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    comment: 'Progress percentage for multi-step badges'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional metadata about how badge was earned'
  }
}, {
  tableName: 'user_badges',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'badge_id']
    }
  ]
});

export default UserBadge;

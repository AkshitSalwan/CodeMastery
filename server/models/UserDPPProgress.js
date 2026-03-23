import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const UserDPPProgress = sequelize.define('UserDPPProgress', {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  problems_solved: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'problems_solved'
  },
  problems_attempted: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'problems_attempted'
  },
  total_problems: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
    field: 'total_problems'
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  max_streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'max_streak'
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'user_dpp_progress',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'date']
    }
  ]
});

export default UserDPPProgress;

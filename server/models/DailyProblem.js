import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const DailyProblem = sequelize.define('DailyProblem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true
  },
  problem_ids: {
    type: DataTypes.JSON,
    allowNull: false,
    field: 'problem_ids',
    comment: 'JSON array of problem IDs for the day'
  },
  difficulty_mix: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'difficulty_mix',
    comment: 'JSON object with difficulty distribution'
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
  tableName: 'daily_problems',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default DailyProblem;

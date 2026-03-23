import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const ContestParticipant = sequelize.define('ContestParticipant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  contest_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'contest_id',
    references: {
      model: 'contests',
      key: 'id'
    }
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
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rank: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  total_time: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_time',
    comment: 'Total time taken in seconds'
  },
  penalty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Total penalty in seconds'
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
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'joined_at'
  },
  finished_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'finished_at'
  },
  status: {
    type: DataTypes.ENUM('registered', 'participating', 'finished', 'disqualified'),
    defaultValue: 'registered'
  }
}, {
  tableName: 'contest_participants',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['contest_id', 'user_id']
    }
  ]
});

export default ContestParticipant;

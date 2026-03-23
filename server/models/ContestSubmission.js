import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const ContestSubmission = sequelize.define('ContestSubmission', {
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
  participant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'participant_id',
    references: {
      model: 'contest_participants',
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
  submission_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'submission_id',
    references: {
      model: 'submissions',
      key: 'id'
    }
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  verdict: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  time_submitted: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'time_submitted'
  },
  time_from_start: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'time_from_start',
    comment: 'Time from contest start in seconds'
  },
  penalty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Penalty for this submission in seconds'
  },
  is_accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_accepted'
  },
  attempt_number: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    field: 'attempt_number'
  }
}, {
  tableName: 'contest_submissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ContestSubmission;

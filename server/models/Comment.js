import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  discussion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'discussion_id',
    references: {
      model: 'discussions',
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
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'parent_id',
    references: {
      model: 'comments',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  upvotes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  downvotes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_answer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_answer'
  },
  is_best_answer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_best_answer'
  },
  is_edited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_edited'
  },
  edited_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'edited_at'
  }
}, {
  tableName: 'comments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Comment;

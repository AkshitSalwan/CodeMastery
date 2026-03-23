import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Bookmark = sequelize.define('Bookmark', {
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
  resource_type: {
    type: DataTypes.ENUM('topic', 'resource', 'problem', 'discussion'),
    allowNull: false,
    field: 'resource_type'
  },
  resource_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'resource_id'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'bookmarks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'resource_type', 'resource_id']
    }
  ]
});

export default Bookmark;

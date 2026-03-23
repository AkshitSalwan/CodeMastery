import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clerk_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    field: 'clerk_id'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  role: {
    type: DataTypes.ENUM('learner', 'interviewer', 'admin'),
    allowNull: false,
    defaultValue: 'learner'
  },
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  github_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'github_url'
  },
  linkedin_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'linkedin_url'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_login'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Instance methods
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.clerk_id; // Don't expose Clerk ID
  return values;
};

export default User;

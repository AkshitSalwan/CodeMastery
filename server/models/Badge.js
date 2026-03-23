import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Badge = sequelize.define('Badge', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Icon URL or icon name'
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    comment: 'Hex color code'
  },
  category: {
    type: DataTypes.ENUM('problem_solving', 'learning', 'contest', 'streak', 'community', 'special'),
    allowNull: false
  },
  criteria: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON object describing badge earning criteria'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rarity: {
    type: DataTypes.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
    defaultValue: 'common'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'badges',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Badge;

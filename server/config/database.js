import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    process.exit(1);
  }
};

// Sync database
const syncDatabase = async (force = false) => {
  try {
    // In development, only sync without altering to avoid conflicts
    // Foreign key constraints prevent force sync
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    // If sync fails due to foreign keys or other constraints, log but continue
    // The tables likely already exist with the correct schema
    console.warn('⚠️  Database sync warning:', error.message);
    console.warn('Continuing anyway - tables may already exist');
  }
};

const ensureAuthSchema = async () => {
  try {
    const queryInterface = sequelize.getQueryInterface();
    const table = await queryInterface.describeTable('users');

    if (!table.phone_number) {
      await queryInterface.addColumn('users', 'phone_number', {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
      });
      console.log('Added users.phone_number column for OTP recovery.');
    }
  } catch (error) {
    console.warn('Auth schema check warning:', error.message);
  }
};

export { sequelize, testConnection, syncDatabase, ensureAuthSchema };
export default sequelize;

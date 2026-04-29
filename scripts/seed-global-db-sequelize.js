import { Sequelize } from 'sequelize';
import 'dotenv/config';
import {
  User,
  Problem,
  Badge,
  UserBadge,
  Topic,
  Submission,
  Discussion,
  Feedback,
  Resource,
  Contest,
  ContestParticipant,
  ContestSubmission,
  DailyProblem,
  LearningProgress,
  Comment,
  Bookmark,
} from '../server/models/index.js';

// Local database connection
const localSequelize = new Sequelize(
  'CodeMastery',
  'root',
  process.env.LOCAL_DB_PASSWORD || 'root', // Set LOCAL_DB_PASSWORD env variable
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: false,
  }
);

// Global database connection (Aiven)
const globalSequelize = new Sequelize(
  'defaultdb',
  'avnadmin',
  process.env.AIVEN_DB_PASSWORD || 'YOUR_AIVEN_PASSWORD', // Set AIVEN_DB_PASSWORD env variable
  {
    host: 'mysql-16b09e66-akshitsalwan2005-cded.a.aivencloud.com',
    dialect: 'mysql',
    port: 16352,
    ssl: true,
    dialectOptions: {
      ssl: 'require',
    },
    logging: false,
  }
);

// Define models for local database
const defineLocalModels = () => {
  const LocalUser = localSequelize.define('User', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: Sequelize.STRING, unique: true, allowNull: false },
    username: { type: Sequelize.STRING, unique: true, allowNull: false },
    password_hash: { type: Sequelize.STRING, allowNull: false },
    role: { type: Sequelize.ENUM('learner', 'interviewer', 'admin'), defaultValue: 'learner' },
  }, { tableName: 'users', timestamps: true, underscored: true });

  const LocalProblem = localSequelize.define('Problem', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: Sequelize.STRING, allowNull: false },
    slug: { type: Sequelize.STRING, unique: true, allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: false },
    difficulty: { type: Sequelize.ENUM('easy', 'medium', 'hard'), defaultValue: 'easy' },
  }, { tableName: 'problems', timestamps: true, underscored: true });

  return { LocalUser, LocalProblem };
};

class SequelizeMigrator {
  constructor() {
    this.localDb = localSequelize;
    this.globalDb = globalSequelize;
  }

  async connect() {
    console.log('📡 Connecting to databases...');
    try {
      await this.localDb.authenticate();
      console.log('✅ Connected to local database');

      await this.globalDb.authenticate();
      console.log('✅ Connected to Aiven global database');
    } catch (error) {
      console.error('❌ Connection failed:', error.message);
      throw error;
    }
  }

  async migrateUsers() {
    console.log('\n👥 Migrating users...');
    try {
      const users = await User.findAll({ raw: true });
      console.log(`Found ${users.length} users in local database`);

      if (users.length > 0) {
        // Clear existing users
        await globalSequelize.query('DELETE FROM users', { type: Sequelize.QueryTypes.DELETE });

        // Batch insert
        for (const user of users) {
          try {
            await globalSequelize.query(
              `INSERT INTO users (id, email, username, password_hash, role, avatar, bio, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              {
                replacements: [
                  user.id,
                  user.email,
                  user.username,
                  user.password_hash,
                  user.role,
                  user.avatar,
                  user.bio,
                  user.created_at,
                  user.updated_at,
                ],
              }
            );
          } catch (error) {
            console.warn(`⚠️  Error inserting user ${user.email}:`, error.message);
          }
        }
        console.log(`✅ ${users.length} users migrated`);
      }
    } catch (error) {
      console.error('❌ Failed to migrate users:', error.message);
    }
  }

  async migrateTopics() {
    console.log('\n📚 Migrating topics...');
    try {
      const topics = await Topic.findAll({ raw: true });
      console.log(`Found ${topics.length} topics in local database`);

      if (topics.length > 0) {
        await globalSequelize.query('DELETE FROM topics');

        for (const topic of topics) {
          try {
            await globalSequelize.query(
              `INSERT INTO topics (id, name, slug, description, difficulty, estimated_time, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              {
                replacements: [
                  topic.id,
                  topic.name,
                  topic.slug,
                  topic.description,
                  topic.difficulty,
                  topic.estimated_time,
                  topic.created_at,
                  topic.updated_at,
                ],
              }
            );
          } catch (error) {
            console.warn(`⚠️  Error inserting topic ${topic.name}:`, error.message);
          }
        }
        console.log(`✅ ${topics.length} topics migrated`);
      }
    } catch (error) {
      console.error('❌ Failed to migrate topics:', error.message);
    }
  }

  async migrateProblems() {
    console.log('\n🧩 Migrating problems...');
    try {
      const problems = await Problem.findAll({ raw: true });
      console.log(`Found ${problems.length} problems in local database`);

      if (problems.length > 0) {
        await globalSequelize.query('DELETE FROM problems');

        for (const problem of problems) {
          try {
            await globalSequelize.query(
              `INSERT INTO problems (id, title, slug, description, difficulty, topic_id, points, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              {
                replacements: [
                  problem.id,
                  problem.title,
                  problem.slug,
                  problem.description,
                  problem.difficulty,
                  problem.topic_id,
                  problem.points,
                  problem.created_at,
                  problem.updated_at,
                ],
              }
            );
          } catch (error) {
            console.warn(`⚠️  Error inserting problem ${problem.slug}:`, error.message);
          }
        }
        console.log(`✅ ${problems.length} problems migrated`);
      }
    } catch (error) {
      console.error('❌ Failed to migrate problems:', error.message);
    }
  }

  async migrateBadges() {
    console.log('\n🏅 Migrating badges...');
    try {
      const badges = await Badge.findAll({ raw: true });
      console.log(`Found ${badges.length} badges in local database`);

      if (badges.length > 0) {
        await globalSequelize.query('DELETE FROM badges');

        for (const badge of badges) {
          try {
            await globalSequelize.query(
              `INSERT INTO badges (id, name, slug, description, icon, color, category, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              {
                replacements: [
                  badge.id,
                  badge.name,
                  badge.slug,
                  badge.description,
                  badge.icon,
                  badge.color,
                  badge.category,
                  badge.created_at,
                  badge.updated_at,
                ],
              }
            );
          } catch (error) {
            console.warn(`⚠️  Error inserting badge ${badge.slug}:`, error.message);
          }
        }
        console.log(`✅ ${badges.length} badges migrated`);
      }
    } catch (error) {
      console.error('❌ Failed to migrate badges:', error.message);
    }
  }

  async migrateSubmissions() {
    console.log('\n📤 Migrating submissions...');
    try {
      const submissions = await Submission.findAll({ raw: true });
      console.log(`Found ${submissions.length} submissions in local database`);

      if (submissions.length > 0) {
        await globalSequelize.query('DELETE FROM submissions');

        for (const submission of submissions) {
          try {
            await globalSequelize.query(
              `INSERT INTO submissions (id, user_id, problem_id, code, language, status, runtime, memory, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              {
                replacements: [
                  submission.id,
                  submission.user_id,
                  submission.problem_id,
                  submission.code,
                  submission.language,
                  submission.status,
                  submission.runtime,
                  submission.memory,
                  submission.created_at,
                  submission.updated_at,
                ],
              }
            );
          } catch (error) {
            console.warn(`⚠️  Error inserting submission ${submission.id}:`, error.message);
          }
        }
        console.log(`✅ ${submissions.length} submissions migrated`);
      }
    } catch (error) {
      console.error('❌ Failed to migrate submissions:', error.message);
    }
  }

  async migrate() {
    try {
      console.log('\n🚀 Starting Sequelize-based database migration...\n');

      // Disable foreign key checks
      await globalSequelize.query('SET FOREIGN_KEY_CHECKS = 0');

      // Run migrations in order
      await this.migrateUsers();
      await this.migrateTopics();
      await this.migrateProblems();
      await this.migrateBadges();
      await this.migrateSubmissions();

      // Re-enable foreign key checks
      await globalSequelize.query('SET FOREIGN_KEY_CHECKS = 1');

      console.log('\n✨ Migration completed successfully!');
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      throw error;
    }
  }

  async close() {
    console.log('\n🔌 Closing database connections...');
    if (this.localDb) {
      await this.localDb.close();
      console.log('✅ Local connection closed');
    }
    if (this.globalDb) {
      await this.globalDb.close();
      console.log('✅ Global connection closed');
    }
  }
}

// Run migration
async function main() {
  const migrator = new SequelizeMigrator();

  try {
    await migrator.connect();
    await migrator.migrate();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await migrator.close();
  }
}

main();

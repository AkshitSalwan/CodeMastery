import mysql from 'mysql2/promise';
import 'dotenv/config';

// Database connections
const LOCAL_DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: 'Akshit@1179',
  database: 'CodeMastery',
  port: 3306,
};

// Extract Aiven password from DATABASE_URL or use from env
const extractAivenPassword = () => {
  if (process.env.AIVEN_DB_PASSWORD) {
    return process.env.AIVEN_DB_PASSWORD;
  }

  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.includes('avnadmin:')) {
    const match = dbUrl.match(/avnadmin:([^@]+)@/);
    if (match && match[1] && match[1] !== 'YOUR_AIVEN_PASSWORD') {
      return match[1];
    }
  }

  // Return placeholder if no password found
  console.error('❌ Aiven database password not found. Set AIVEN_DB_PASSWORD environment variable.');
  return 'YOUR_AIVEN_PASSWORD';
};

const GLOBAL_DB_CONFIG = {
  host: 'mysql-16b09e66-akshitsalwan2005-cded.a.aivencloud.com',
  user: 'avnadmin',
  password: extractAivenPassword(),
  database: 'defaultdb',
  port: 16352,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Tables to migrate in order (respecting foreign keys)
const TABLES_TO_MIGRATE = [
  'users',
  'topics',
  'problems',
  'badges',
  'user_badges',
  'submissions',
  'comments',
  'discussions',
  'feedback',
  'bookmarks',
  'learning_progress',
  'daily_problems',
  'contests',
  'contest_participants',
  'contest_submissions',
  'resources',
  'user_dpp_progress',
];

class DatabaseMigrator {
  constructor() {
    this.localConnection = null;
    this.globalConnection = null;
  }

  async connect() {
    console.log('📡 Connecting to databases...');
    try {
      this.localConnection = await mysql.createConnection(LOCAL_DB_CONFIG);
      console.log('✅ Connected to local database');

      this.globalConnection = await mysql.createConnection(GLOBAL_DB_CONFIG);
      console.log('✅ Connected to Aiven global database');
    } catch (error) {
      console.error('❌ Connection failed:', error.message);
      throw error;
    }
  }

  async getTableSchema(tableName) {
    try {
      const [rows] = await this.localConnection.query(`DESCRIBE ${tableName}`);
      return rows;
    } catch (error) {
      console.error(`❌ Failed to get schema for ${tableName}:`, error.message);
      return null;
    }
  }

  async getAllData(tableName) {
    try {
      const [rows] = await this.localConnection.query(`SELECT * FROM ${tableName}`);
      return rows;
    } catch (error) {
      console.error(`❌ Failed to fetch data from ${tableName}:`, error.message);
      return [];
    }
  }

  async clearTable(tableName) {
    try {
      await this.globalConnection.query(`DELETE FROM ${tableName}`);
      console.log(`🧹 Cleared ${tableName} in global database`);
    } catch (error) {
      console.warn(`⚠️  Could not clear ${tableName} (might not exist): ${error.message}`);
    }
  }

  async insertData(tableName, data) {
    if (data.length === 0) {
      console.log(`⏭️  No data to migrate for ${tableName}`);
      return;
    }

    try {
      const columns = Object.keys(data[0]);
      const placeholders = columns.map(() => '?').join(',');
      const sql = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders})`;

      let successCount = 0;
      let errorCount = 0;

      // Batch insert
      for (const row of data) {
        try {
          const values = columns.map(col => row[col]);
          await this.globalConnection.query(sql, values);
          successCount++;
        } catch (error) {
          errorCount++;
          console.warn(`⚠️  Error inserting row in ${tableName}:`, error.message);
        }
      }

      console.log(`✅ ${tableName}: ${successCount}/${data.length} rows inserted`);
      if (errorCount > 0) {
        console.warn(`⚠️  ${errorCount} rows failed to insert`);
      }
    } catch (error) {
      console.error(`❌ Failed to insert data into ${tableName}:`, error.message);
    }
  }

  async disableForeignKeyChecks() {
    try {
      await this.globalConnection.query('SET FOREIGN_KEY_CHECKS = 0');
      console.log('🔓 Disabled foreign key checks on global database');
    } catch (error) {
      console.warn('⚠️  Could not disable foreign key checks:', error.message);
    }
  }

  async enableForeignKeyChecks() {
    try {
      await this.globalConnection.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('🔒 Re-enabled foreign key checks on global database');
    } catch (error) {
      console.warn('⚠️  Could not re-enable foreign key checks:', error.message);
    }
  }

  async migrateTable(tableName) {
    console.log(`\n📋 Migrating ${tableName}...`);

    try {
      // Check if table exists in global database
      try {
        await this.getTableSchema(tableName);
      } catch (error) {
        console.warn(`⚠️  Table ${tableName} might not exist in global database, skipping...`);
        return;
      }

      // Clear existing data
      await this.clearTable(tableName);

      // Get all data from local database
      const data = await this.getAllData(tableName);

      // Insert into global database
      await this.insertData(tableName, data);
    } catch (error) {
      console.error(`❌ Migration failed for ${tableName}:`, error.message);
    }
  }

  async migrate() {
    try {
      console.log('\n🚀 Starting database migration...\n');

      await this.disableForeignKeyChecks();

      for (const table of TABLES_TO_MIGRATE) {
        await this.migrateTable(table);
      }

      await this.enableForeignKeyChecks();

      console.log('\n✨ Migration completed successfully!');
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      throw error;
    }
  }

  async close() {
    console.log('\n🔌 Closing database connections...');
    if (this.localConnection) {
      await this.localConnection.end();
      console.log('✅ Local connection closed');
    }
    if (this.globalConnection) {
      await this.globalConnection.end();
      console.log('✅ Global connection closed');
    }
  }
}

// Run migration
async function main() {
  const migrator = new DatabaseMigrator();

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

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
};

class SmartDatabaseMigrator {
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

  async getTableColumns(connection, database, tableName) {
    try {
      const [rows] = await connection.query(
        `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
        [database, tableName]
      );
      return rows.map(r => ({ name: r.COLUMN_NAME, type: r.DATA_TYPE }));
    } catch (error) {
      return null;
    }
  }

  async getMatchingColumns(tableName) {
    const localColumns = await this.getTableColumns(this.localConnection, 'CodeMastery', tableName);
    const globalColumns = await this.getTableColumns(this.globalConnection, 'defaultdb', tableName);

    if (!localColumns || !globalColumns) {
      return null;
    }

    // Find common columns
    const commonColumns = localColumns.filter(lc =>
      globalColumns.some(gc => gc.name === lc.name)
    );

    return {
      local: commonColumns.map(c => c.name),
      global: commonColumns.map(c => c.name),
      types: commonColumns.map(c => c.type),
    };
  }

  async migrateTableSmartly(tableName) {
    console.log(`\n📋 Migrating ${tableName}...`);

    try {
      // Get matching columns
      const columns = await this.getMatchingColumns(tableName);
      if (!columns) {
        console.log(`⏭️  Table ${tableName} skipped (schema mismatch or not found)`);
        return;
      }

      if (columns.local.length === 0) {
        console.log(`⏭️  No common columns found for ${tableName}`);
        return;
      }

      // Clear existing data
      try {
        await this.globalConnection.query(`DELETE FROM ${tableName}`);
        console.log(`🧹 Cleared ${tableName} in global database`);
      } catch (error) {
        console.warn(`⚠️  Could not clear ${tableName}: ${error.message}`);
      }

      // Build the insert query with column mapping
      const localColumnList = columns.local.map(c => `\`${c}\``).join(', ');
      const globalColumnList = columns.global.map(c => `\`${c}\``).join(', ');

      // Get data from local database
      const [rows] = await this.localConnection.query(
        `SELECT ${localColumnList} FROM \`${tableName}\``
      );

      if (rows.length === 0) {
        console.log(`⏭️  No data to migrate for ${tableName}`);
        return;
      }

      console.log(`Found ${rows.length} rows to migrate`);

      let successCount = 0;
      let errorCount = 0;

      // Insert rows with proper JSON handling
      for (const row of rows) {
        try {
          const values = columns.local.map((col, idx) => {
            let value = row[col];

            // Handle JSON fields
            if (columns.types[idx] === 'json' && value !== null && value !== undefined) {
              try {
                // If it's already an object, stringify it
                if (typeof value === 'object') {
                  return JSON.stringify(value);
                }

                // If it's a string, try to parse and re-stringify to ensure valid JSON
                if (typeof value === 'string') {
                  // Remove leading/trailing quotes if they exist
                  let cleaned = value.trim();
                  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
                    cleaned = cleaned.slice(1, -1);
                  }

                  // If it contains newlines, treat as a single string in an array or as a string
                  if (cleaned.includes('\n')) {
                    return JSON.stringify(cleaned);
                  }

                  // Try to parse as JSON
                  try {
                    const parsed = JSON.parse(cleaned);
                    return JSON.stringify(parsed);
                  } catch (e) {
                    // If not valid JSON, wrap in quotes
                    return JSON.stringify(cleaned);
                  }
                }
              } catch (e) {
                console.warn(`⚠️  Could not process JSON for column ${col}: ${e.message}`);
                return JSON.stringify(value);
              }
            }

            return value;
          });

          const placeholders = columns.local.map(() => '?').join(', ');
          const sql = `INSERT INTO \`${tableName}\` (${globalColumnList}) VALUES (${placeholders})`;

          await this.globalConnection.query(sql, values);
          successCount++;
        } catch (error) {
          errorCount++;
          console.warn(`⚠️  Error inserting row: ${error.message}`);
        }
      }

      console.log(`✅ ${tableName}: ${successCount}/${rows.length} rows inserted`);
      if (errorCount > 0) {
        console.warn(`⚠️  ${errorCount} rows failed to insert`);
      }
    } catch (error) {
      console.error(`❌ Failed to migrate ${tableName}:`, error.message);
    }
  }

  async migrate() {
    const TABLES_TO_MIGRATE = [
      'users',
      'topics',
      'problems',
      'badges',
      'user_badges',
      'submissions',
      'learning_progress',
      'daily_problems',
      'feedback',
    ];

    try {
      console.log('\n🚀 Starting smart database migration...\n');

      await this.globalConnection.query('SET FOREIGN_KEY_CHECKS = 0');
      console.log('🔓 Disabled foreign key checks on global database\n');

      for (const table of TABLES_TO_MIGRATE) {
        await this.migrateTableSmartly(table);
      }

      await this.globalConnection.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('\n🔒 Re-enabled foreign key checks on global database');

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
  const migrator = new SmartDatabaseMigrator();

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

#!/usr/bin/env node

/**
 * Database Migration CLI
 * Migrates data from local MySQL to Aiven global database
 * 
 * Usage:
 *   npm run migrate:global              # Run with mysql2 (faster)
 *   npm run migrate:global-sequelize    # Run with Sequelize (ORM-based)
 *   node scripts/cli.js --help          # Show help
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);

const showHelp = () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║           DATABASE MIGRATION CLI - CodeMastery                  ║
╚════════════════════════════════════════════════════════════════╝

DESCRIPTION:
  Migrates data from local MySQL database to Aiven global database

USAGE:
  npm run migrate:global              # Use mysql2/promise (recommended)
  npm run migrate:global-sequelize    # Use Sequelize ORM

SCRIPTS AVAILABLE:
  ${fs.readdirSync(__dirname)
    .filter(f => f.startsWith('seed-') && f.endsWith('.js'))
    .map(f => `  - ${f}`)
    .join('\n')}

ENVIRONMENT VARIABLES REQUIRED:
  AIVEN_DB_PASSWORD     Your Aiven database password
  (or use the hardcoded password in .env)

EXAMPLE:
  1. Make sure local MySQL is running
  2. Run: npm run migrate:global
  3. Check the console for migration results

OPTIONS:
  --help, -h            Show this help message
  --local-only          List local database tables only
  --global-only         List global database tables only

  `);
};

if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

if (args.includes('--local-only')) {
  console.log('📋 Local tables:');
  console.log('  - users');
  console.log('  - topics');
  console.log('  - problems');
  console.log('  - badges');
  console.log('  - submissions');
  console.log('  - comments');
  console.log('  - discussions');
  console.log('  - feedback');
  console.log('  - bookmarks');
  console.log('  - learning_progress');
  console.log('  - daily_problems');
  console.log('  - contests');
  console.log('  - contest_participants');
  console.log('  - contest_submissions');
  console.log('  - resources');
  console.log('  - user_badges');
  console.log('  - user_dpp_progress');
  process.exit(0);
}

console.log('🚀 Starting migration...\n');
console.log('Local Database: mysql://root:***@localhost:3306/CodeMastery');
console.log('Global Database: Aiven Cloud MySQL\n');

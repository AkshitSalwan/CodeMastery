# Database Migration Guide

This guide explains how to migrate data from your local MySQL database to the Aiven global database.

## 📋 Overview

You have two migration scripts available:

1. **`seed-global-db.js`** - Direct MySQL connection (faster, recommended)
2. **`seed-global-db-sequelize.js`** - Uses Sequelize ORM

## 🚀 Quick Start

### Option 1: Using Direct MySQL Connection (Recommended)

```bash
npm run migrate:global
```

This uses the `mysql2/promise` package for a fast, direct migration.

### Option 2: Using Sequelize

```bash
npm run migrate:global-sequelize
```

This uses your existing Sequelize models.

## 📊 Tables Migrated

The scripts migrate the following tables in order:

- `users` - User accounts and profiles
- `topics` - Learning topics/categories
- `problems` - Coding problems
- `badges` - Achievement badges
- `user_badges` - User-badge relationships
- `submissions` - Code submissions
- `comments` - Problem comments
- `discussions` - Discussion threads
- `feedback` - User feedback
- `bookmarks` - Bookmarked problems
- `learning_progress` - Learning progress tracking
- `daily_problems` - Daily problem data
- `contests` - Programming contests
- `contest_participants` - Contest participation
- `contest_submissions` - Contest submissions
- `resources` - Learning resources
- `user_dpp_progress` - Daily Practice Plan progress

## ⚙️ Configuration

### Environment Variables

Make sure your `.env` file has:

```env
AIVEN_DB_PASSWORD=your-aiven-password  # Optional if hardcoded
DATABASE_URL=mysql://avnadmin:...      # Your Aiven URL
```

### Database Credentials

**Local Database:**
- Host: `localhost`
- User: `root`
- Password: `Akshit@1179`
- Database: `CodeMastery`

**Global Database (Aiven):**
- Configured in `.env`

## 📝 Usage Examples

### Show Help

```bash
npm run migrate:help
```

### List Tables

```bash
npm run migrate:list-tables
```

### Run Migration

```bash
# Recommended (faster)
npm run migrate:global

# Or using Sequelize
npm run migrate:global-sequelize
```

## 🔍 What Happens During Migration

1. **Connection**: Connects to both local and Aiven databases
2. **Disable FK Checks**: Temporarily disables foreign key constraints
3. **Clear Tables**: Removes existing data from global database
4. **Migrate Data**: Copies all data from local to global database
5. **Enable FK Checks**: Re-enables foreign key constraints
6. **Close Connections**: Closes database connections

## ✅ Success Indicators

Look for output like:

```
✅ Connected to local database
✅ Connected to Aiven global database
🧹 Cleared users in global database
✅ users: 5/5 rows inserted
✅ topics: 12/12 rows inserted
✅ problems: 150/150 rows inserted
...
✨ Migration completed successfully!
```

## ⚠️ Warnings

If you see warnings like:

```
⚠️  Error inserting row in problems: Duplicate entry
```

This usually means some rows failed due to constraints. The script will still migrate successfully but may skip problematic rows.

## 🐛 Troubleshooting

### Connection Refused

**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution**: 
- Ensure local MySQL is running
- Check credentials in the script

### SSL Certificate Error

**Problem**: `Error: self signed certificate`

**Solution**: 
- Aiven requires SSL - ensure `ssl: true` is set
- This is already configured in the scripts

### Foreign Key Constraint Error

**Problem**: `Error: 1452 Cannot add or update a child row`

**Solution**:
- Ensure tables are migrated in correct order (done automatically)
- Check data integrity in local database

### Permission Denied

**Problem**: `FATAL ERROR: unable to write to disk`

**Solution**:
- Check file permissions
- Ensure you have write access to the project directory

## 📊 Performance Notes

**Direct MySQL (Recommended)**
- Faster than Sequelize
- Use when you need speed
- Better for large datasets

**Sequelize Migration**
- Uses your existing models
- Slower but more controlled
- Better for complex data transformations

## 🔄 Re-running Migration

You can safely re-run the migration multiple times. The script will:
1. Clear existing data from global database
2. Re-insert all data from local database

**Warning**: This will delete any data added directly to the global database!

## 📝 Custom Migration

To add custom logic:

1. Edit `scripts/seed-global-db.js` or `scripts/seed-global-db-sequelize.js`
2. Add your custom migration logic
3. Run: `npm run migrate:global`

## ✨ Advanced Features

### Batch Processing

Both scripts include batch processing for better performance with large datasets.

### Error Handling

Scripts will:
- Skip rows with errors
- Log warnings for investigation
- Continue with remaining data
- Report final success/failure count

### Connection Pooling

Sequelize version includes connection pooling for better resource management.

## 📞 Support

For issues:

1. Check the error messages in console output
2. Verify database credentials
3. Ensure both databases are accessible
4. Check `.env` file configuration

---

**Last Updated**: April 29, 2026

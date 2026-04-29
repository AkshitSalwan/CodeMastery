# Scripts Directory

This directory contains all utility scripts for testing, seeding, and maintenance of the CodeMastery platform.

## Folder Structure

### `/utils`
Utility scripts for fixes, debugging, problem management, and initialization.

**See [utils/INDEX.md](./utils/INDEX.md) for complete documentation.**

**Quick Commands:**
```bash
# Fix boilerplate code
node scripts/utils/fix-all-boilerplate.js

# Initialize demo users
node scripts/utils/INIT_DEMO_USERS.js

# Add new problems
node scripts/utils/ADD_JOLLY_PROBLEM.js
```

### `/test`
Comprehensive test suite for the entire application.

**Test Scripts:**
- `test-code-submission.mjs` - Tests code submission functionality
- `test-submissions.mjs` - Tests submission processing and validation
- `submission-test-final.mjs` - Final submission testing suite
- `test-all-langs.mjs` - Tests all programming language compilers
- `test-correct-solutions.mjs` - Validates correct solution implementations
- `test-token-flow.mjs` - Tests authentication token flow
- `test-pipeline.mjs` - Tests complete pipeline execution
- `test-submission-all.mjs` - Comprehensive submission tests
- `test-simple.mjs` - Basic functionality tests
- `simple-test.sh` - Simple bash test runner
- `test-full-pipeline.sh` - Full pipeline shell test script
- `test_submission.json` - Test data for submissions

**Running Tests:**
```bash
# Run specific test
npm run test-code-submission

# Run all tests
npm run test-all
```

### `/seeders`
Database seeders for initial data setup and testing.

**Seeders:**
- `index.js` - Main seeder orchestrator
- `createAdminUser.js` - Creates initial admin user

**Running Seeders:**
```bash
# Run all seeders
node scripts/seeders/index.js

# Create admin user
node scripts/seeders/createAdminUser.js
```

## Quick Commands

Update your `package.json` scripts to reference the new locations:

```json
{
  "scripts": {
    "test": "node scripts/test/test-pipeline.mjs",
    "test:all": "node scripts/test/test-submission-all.mjs",
    "seed": "node scripts/seeders/index.js",
    "seed:admin": "node scripts/seeders/createAdminUser.js"
  }
}
```

## Notes

- Some seeder files remain in `server/seeders/` for backward compatibility
- Test scripts use ESM (ES Modules) format (.mjs)
- Seeder scripts use CommonJS format (.js)
- All scripts are relative to the project root

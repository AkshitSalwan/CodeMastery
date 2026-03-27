# CodeMastery Platform - Test Scripts Guide

## 📋 Overview

This directory contains comprehensive test scripts to validate the CodeMastery platform functionality.

## 🧪 Available Tests

### 1. **validate-platform.mjs** (Quick Validation)
Validates critical platform components without external API calls.

**What it checks:**
- ✅ JSON file validity (jolly-problem.json)
- ✅ Judge0 Service methods and language mappings
- ✅ CodeEditorPage authentication setup
- ✅ Database configuration
- ✅ Authentication middleware
- ✅ Problem controller endpoints

**Usage:**
```bash
node scripts/test/validate-platform.mjs
```

**Expected Output:**
```
🎉 All validation checks passed!
✨ Your CodeMastery platform is ready to use!
```

---

### 2. **test-jolly-problem.mjs** (Problem Logic Testing)
Tests the "Search Jolly" problem solution with 6 test cases.

**What it tests:**
- Single word detection ("jolly" → true)
- Alternative keyword detection ("bunts" → "biceps")
- Negative cases (neither word → false)
- Multiple word parsing
- Keyword priority handling

**Usage:**
```bash
node scripts/test/test-jolly-problem.mjs
```

**Test Cases:**
| Input | Expected | Status |
|-------|----------|--------|
| jolly | true | ✅ |
| bunts | biceps | ✅ |
| happy sad | false | ✅ |
| hello jolly world | true | ✅ |
| bunts bunts | biceps | ✅ |
| jolly bunts | true | ✅ |

---

### 3. **test-jolly-json.mjs** (API Integration Testing)
Tests the jolly problem API integration with authentication.

**What it tests:**
- Problem JSON parsing
- Authentication token generation
- API endpoint response
- Problem database existence
- Starter code in multiple languages

**Usage:**
```bash
node scripts/test/test-jolly-json.mjs
```

**Sample Output:**
```
🔐 Getting authentication token...
✓ Authentication successful

✓ JSON file parsed successfully
  Problem: "Search Jolly"
  Slug: search-jolly
✓ Starter code is valid JSON
  Languages available: java, python, javascript
📤 Testing API endpoint...
✓ Problem already exists in database!
```

---

### 4. **test-complete-suite.mjs** (Comprehensive Testing)
Full test suite covering authentication, code execution, and system integration.

**What it tests:**
1. User login and authentication
2. Problem fetching by slug
3. All problems retrieval
4. Code submission (JavaScript, Python, Java)
5. Judge0 service health
6. User submissions retrieval
7. Auth token validation
8. JSON file validation

**Usage:**
```bash
node scripts/test/test-complete-suite.mjs
```

**Note:** Requires backend server running on `http://localhost:4000`

---

## 🚀 Quick Start

### 1. Validate Platform Setup
```bash
# Check all components are properly configured
node scripts/test/validate-platform.mjs
```

### 2. Test Problem Logic
```bash
# Verify the jolly problem test cases pass
node scripts/test/test-jolly-problem.mjs
```

### 3. Test JSON Format
```bash
# Verify JSON parsing and problem setup
node scripts/test/test-jolly-json.mjs
```

### 4. Full Integration Test (requires server running)
```bash
# Start the server first:
npm run dev

# In another terminal, run complete test suite:
node scripts/test/test-complete-suite.mjs
```

---

## 🔧 Manual Testing via cURL

### Test Code Submission
```bash
# 1. Get authentication token
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@codemastery.com","password":"admin123456"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 2. Submit code for testing
curl -X POST http://localhost:4000/api/problems/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "language": "javascript",
    "code": "function checkWords(arr) { for(let w of arr) { if(w==='\''jolly'\'') return true; if(w==='\''bunts'\'') return '\''biceps'\''; } return false; }",
    "testCases": [
      {"input": "jolly", "output": "true"},
      {"input": "bunts", "output": "biceps"}
    ]
  }'
```

---

## 📊 Test Results Interpretation

### ✅ All Tests Pass
Platform is ready for production use. All components working correctly.

### ⚠️ Some Tests Fail
1. Check error messages for specific component details
2. Review the corresponding component files
3. Ensure all dependencies are installed
4. Verify environment variables are configured

### ❌ Critical Failures
1. Judge0 Service: Verify judge0 language mappings
2. Authentication: Check auth middleware configuration
3. Database: Verify database connection string
4. File Issues: Ensure all required files exist

---

## 🔐 Authentication Setup

The test scripts automatically handle authentication:

1. **Environment Variables:**
   ```bash
   # Add to .env
   JWT_SECRET=your_secret_key
   JUDGE0_SECRET=your_judge0_key
   ```

2. **Test Credentials:**
   - Email: `admin@codemastery.com`
   - Password: `admin123456`

3. **Token Usage:**
   ```javascript
   const headers = {
     'Authorization': `Bearer ${token}`
   };
   ```

---

## 📝 Writing Custom Tests

### Example Test Structure
```javascript
const test = async (name, fn) => {
  try {
    await fn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}: ${error.message}`);
  }
};

// Usage
await test('My Test', async () => {
  // test logic here
  if (!condition) throw new Error('Test failed');
});
```

---

## 🐛 Debugging Tests

### Enable Verbose Logging
```bash
DEBUG=* node scripts/test/validate-platform.mjs
```

### Check Specific Component
```bash
# Verify Judge0 service
node -e "import('./server/services/judgeService.js').then(m => console.log(Object.keys(m.default)))"

# Check auth middleware
grep -n "Authorization" server/middleware/auth.js

# Verify problem controller
grep -n "export const" server/controllers/problemController.js
```

---

## 📈 Continuous Testing

### Automated Test Runs
Add to `package.json`:
```json
{
  "scripts": {
    "test": "node scripts/test/validate-platform.mjs",
    "test:complete": "node scripts/test/test-complete-suite.mjs",
    "test:problem": "node scripts/test/test-jolly-problem.mjs"
  }
}
```

---

## ✨ Test Coverage

| Component | Test | Status |
|-----------|------|--------|
| JSON Files | validate-platform.mjs | ✅ |
| Judge0 Service | validate-platform.mjs + test-complete-suite.mjs | ✅ |
| Authentication | test-complete-suite.mjs + test-jolly-json.mjs | ✅ |
| Code Execution | test-complete-suite.mjs | ✅ |
| Problem Logic | test-jolly-problem.mjs | ✅ |
| Database | validate-platform.mjs | ✅ |
| API Endpoints | test-complete-suite.mjs | ✅ |

---

**Last Updated:** March 25, 2026  
**Version:** 1.0  
**Status:** ✅ All Tests Passing

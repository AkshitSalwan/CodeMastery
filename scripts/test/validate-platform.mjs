#!/usr/bin/env node

/**
 * Quick Validation Script
 * Checks critical functionality without making external API calls
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 CodeMastery Platform - Quick Validation\n');
console.log('==========================================\n');

const checks = [];

// Check 1: JSON File Validity
console.log('1️⃣  Checking JSON Files...');
try {
  const jsonPath = './jolly-problem.json';
  if (!fs.existsSync(jsonPath)) {
    throw new Error('jolly-problem.json not found');
  }

  const content = fs.readFileSync(jsonPath, 'utf8');
  const problem = JSON.parse(content);

  if (!problem.title) throw new Error('Missing: title');
  if (!problem.slug) throw new Error('Missing: slug');
  if (!problem.starter_code) throw new Error('Missing: starter_code');

  const starterCode = JSON.parse(problem.starter_code);
  const languages = Object.keys(starterCode);

  console.log(`   ✅ jolly-problem.json is valid`);
  console.log(`   📝 Title: ${problem.title}`);
  console.log(`   🏷️  Slug: ${problem.slug}`);
  console.log(`   💻 Languages: ${languages.join(', ')}`);
  checks.push({ name: 'JSON Validation', passed: true });
} catch (error) {
  console.log(`   ❌ JSON Validation failed: ${error.message}`);
  checks.push({ name: 'JSON Validation', passed: false });
}

// Check 2: Judge0 Service
console.log('\n2️⃣  Checking Judge0 Service...');
try {
  const judgeService = await import('../../server/services/judgeService.js');

  const methods = {
    runJudge: 'function',
    getLanguageId: 'function',
    executeCode: 'function'
  };

  for (const [method, type] of Object.entries(methods)) {
    if (typeof judgeService.default[method] !== type) {
      throw new Error(`Missing or invalid method: ${method}`);
    }
  }

  // Test language ID mapping
  const testLanguages = {
    javascript: 63,
    python: 71,
    java: 62,
    cpp: 54
  };

  for (const [lang, expectedId] of Object.entries(testLanguages)) {
    const id = judgeService.default.getLanguageId(lang);
    if (id !== expectedId) {
      throw new Error(`Language ${lang}: expected ${expectedId}, got ${id}`);
    }
  }

  console.log(`   ✅ Judge0 Service is healthy`);
  console.log(`   📦 Methods: ${Object.keys(methods).join(', ')}`);
  console.log(`   🗣️  Languages: ${Object.keys(testLanguages).join(', ')}`);
  checks.push({ name: 'Judge0 Service', passed: true });
} catch (error) {
  console.log(`   ❌ Judge0 Service check failed: ${error.message}`);
  checks.push({ name: 'Judge0 Service', passed: false });
}

// Check 3: CodeEditorPage Authentication
console.log('\n3️⃣  Checking CodeEditorPage Authentication...');
try {
  const editorPath = './src/pages/CodeEditorPage.jsx';
  if (!fs.existsSync(editorPath)) {
    throw new Error('CodeEditorPage.jsx not found');
  }

  const content = fs.readFileSync(editorPath, 'utf8');

  if (!content.includes('getAuthHeaders')) {
    throw new Error('Missing: getAuthHeaders function');
  }

  if (!content.includes('Authorization')) {
    throw new Error('Missing: Authorization header setup');
  }

  if (!content.includes('Bearer')) {
    throw new Error('Missing: Bearer token format');
  }

  const authHeaderCount = (content.match(/getAuthHeaders/g) || []).length;

  console.log(`   ✅ CodeEditorPage has authentication setup`);
  console.log(`   🔐 Auth function calls: ${authHeaderCount}`);
  checks.push({ name: 'CodeEditorPage Auth', passed: true });
} catch (error) {
  console.log(`   ❌ CodeEditorPage check failed: ${error.message}`);
  checks.push({ name: 'CodeEditorPage Auth', passed: false });
}

// Check 4: Database Connection (Basic)
console.log('\n4️⃣  Checking Database Configuration...');
try {
  const configPath = './server/config/database.js';
  if (!fs.existsSync(configPath)) {
    throw new Error('database.js config not found');
  }

  const content = fs.readFileSync(configPath, 'utf8');

  if (!content.includes('sequelize') && !content.includes('Sequelize')) {
    throw new Error('Sequelize not configured');
  }

  console.log(`   ✅ Database configuration found`);
  checks.push({ name: 'Database Config', passed: true });
} catch (error) {
  console.log(`   ❌ Database check failed: ${error.message}`);
  checks.push({ name: 'Database Config', passed: false });
}

// Check 5: Authentication Middleware
console.log('\n5️⃣  Checking Authentication Middleware...');
try {
  const authPath = './server/middleware/auth.js';
  if (!fs.existsSync(authPath)) {
    throw new Error('auth.js middleware not found');
  }

  const content = fs.readFileSync(authPath, 'utf8');

  if (!content.includes('generateToken') && !content.includes('verifyToken')) {
    throw new Error('Token functions not found');
  }

  if (!content.includes('Bearer')) {
    throw new Error('Bearer token handling not found');
  }

  console.log(`   ✅ Authentication middleware is configured`);
  checks.push({ name: 'Auth Middleware', passed: true });
} catch (error) {
  console.log(`   ❌ Auth middleware check failed: ${error.message}`);
  checks.push({ name: 'Auth Middleware', passed: false });
}

// Check 6: Problem Controller
console.log('\n6️⃣  Checking Problem Controller...');
try {
  const controllerPath = './server/controllers/problemController.js';
  if (!fs.existsSync(controllerPath)) {
    throw new Error('problemController.js not found');
  }

  const content = fs.readFileSync(controllerPath, 'utf8');

  const requiredFunctions = ['getAllProblems', 'getProblemBySlug', 'runCode', 'submitSolution'];
  const missingFunctions = requiredFunctions.filter(fn => !content.includes(`export const ${fn}`));

  if (missingFunctions.length > 0) {
    throw new Error(`Missing functions: ${missingFunctions.join(', ')}`);
  }

  console.log(`   ✅ Problem controller has all required endpoints`);
  console.log(`   🔧 Functions: ${requiredFunctions.join(', ')}`);
  checks.push({ name: 'Problem Controller', passed: true });
} catch (error) {
  console.log(`   ❌ Problem controller check failed: ${error.message}`);
  checks.push({ name: 'Problem Controller', passed: false });
}

// Summary
console.log('\n\n📊 Validation Summary');
console.log('=====================\n');

const passed = checks.filter(c => c.passed).length;
const failed = checks.filter(c => !c.passed).length;

checks.forEach(check => {
  const icon = check.passed ? '✅' : '❌';
  console.log(`${icon} ${check.name}`);
});

console.log(`\n📈 Results: ${passed}/${checks.length} checks passed`);

if (failed === 0) {
  console.log('\n🎉 All validation checks passed!');
  console.log('\n✨ Your CodeMastery platform is ready to use!\n');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${failed} check(s) need attention.\n`);
  process.exit(1);
}

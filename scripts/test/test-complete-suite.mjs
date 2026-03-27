#!/usr/bin/env node

/**
 * Comprehensive Test Suite for CodeMastery Platform
 * Tests: Authentication, Code Submission, Judge0 Integration, Problem Management
 */

import fetch from 'node-fetch';
import fs from 'fs';

const API_URL = 'http://localhost:4000/api';
const TEST_PROBLEM_SLUG = 'search-jolly';

class CodeMasteryTester {
  constructor() {
    this.token = null;
    this.userId = null;
    this.testsPassed = 0;
    this.testsFailed = 0;
  }

  async test(name, fn) {
    try {
      console.log(`\n📝 Testing: ${name}`);
      await fn();
      console.log(`✅ PASS: ${name}`);
      this.testsPassed++;
    } catch (error) {
      console.error(`❌ FAIL: ${name}`);
      console.error(`   Error: ${error.message}`);
      this.testsFailed++;
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    const response = await fetch(url, { ...options, headers });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${typeof data === 'object' ? data.error : data}`
      );
    }

    return data;
  }

  async run() {
    console.log('🚀 CodeMastery Platform Test Suite');
    console.log('==================================\n');

    // Test 1: Authentication
    await this.test('User Login', async () => {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'admin@codemastery.com',
          password: 'admin123456'
        })
      });

      if (!response.token) throw new Error('No token received');
      this.token = response.token;
      this.userId = response.user?.id;
      console.log(`   Token received: ${this.token.substring(0, 20)}...`);
      console.log(`   User ID: ${this.userId}`);
    });

    // Test 2: Verify Problem Exists
    await this.test('Fetch Problem by Slug', async () => {
      const response = await this.request(`/problems/${TEST_PROBLEM_SLUG}`);
      if (!response.problem) throw new Error('No problem found');

      const problem = response.problem;
      console.log(`   Problem: ${problem.title}`);
      console.log(`   ID: ${problem.id}`);
      console.log(`   Difficulty: ${problem.difficulty}`);
      console.log(`   Test Cases: ${problem.test_cases?.length || 0}`);
      console.log(`   Languages: ${Object.keys(JSON.parse(problem.starter_code || '{}')).join(', ')}`);
    });

    // Test 3: Get All Problems
    await this.test('Fetch All Problems', async () => {
      const response = await this.request('/problems?limit=5');
      if (!Array.isArray(response.rows)) throw new Error('Invalid response format');
      console.log(`   Total problems: ${response.count}`);
      console.log(`   Fetched: ${response.rows.length} problems`);
    });

    // Test 4: Test Code Submission - JavaScript
    await this.test('Submit Code (JavaScript)', async () => {
      const jsCode = `
function checkWords(arr) {
    for (let word of arr) {
        if (word === "jolly") return true;
        if (word === "bunts") return "biceps";
    }
    return false;
}
const input = "jolly happy";
const result = checkWords(input.split(" "));
console.log(result);
      `;

      const response = await this.request('/problems/run', {
        method: 'POST',
        body: JSON.stringify({
          language: 'javascript',
          code: jsCode,
          testCases: [
            { input: 'jolly', output: 'true' },
            { input: 'bunts', output: 'biceps' }
          ]
        })
      });

      console.log(`   Status: ${response.status}`);
      console.log(`   Test results: ${response.testResults?.length || 0} cases`);
    });

    // Test 5: Test Code Submission - Python
    await this.test('Submit Code (Python)', async () => {
      const pyCode = `
def check_words(arr):
    for word in arr:
        if word == "jolly":
            return True
        if word == "bunts":
            return "biceps"
    return False

arr = ["jolly", "happy"]
print(check_words(arr))
      `;

      const response = await this.request('/problems/run', {
        method: 'POST',
        body: JSON.stringify({
          language: 'python',
          code: pyCode,
          testCases: [
            { input: 'jolly', output: 'true' },
            { input: 'bunts', output: 'biceps' }
          ]
        })
      });

      console.log(`   Status: ${response.status}`);
      console.log(`   Test results: ${response.testResults?.length || 0} cases`);
    });

    // Test 6: Test Code Submission - Java
    await this.test('Submit Code (Java)', async () => {
      const javaCode = `
public class Main {
    public static Object checkWords(String[] arr) {
        for (String word : arr) {
            if (word.equals("jolly")) return true;
            if (word.equals("bunts")) return "biceps";
        }
        return false;
    }

    public static void main(String[] args) {
        String[] arr = {"jolly", "happy"};
        System.out.println(checkWords(arr));
    }
}
      `;

      const response = await this.request('/problems/run', {
        method: 'POST',
        body: JSON.stringify({
          language: 'java',
          code: javaCode,
          testCases: [
            { input: 'jolly', output: 'true' },
            { input: 'bunts', output: 'biceps' }
          ]
        })
      });

      console.log(`   Status: ${response.status}`);
      console.log(`   Test results: ${response.testResults?.length || 0} cases`);
    });

    // Test 7: Verify Judge0 Service
    await this.test('Judge0 Service Health', async () => {
      // Test the service directly
      const judgeService = await import('./server/services/judgeService.js');
      
      const methods = ['runJudge', 'getLanguageId', 'executeCode'];
      for (const method of methods) {
        if (typeof judgeService.default[method] !== 'function') {
          throw new Error(`Missing method: ${method}`);
        }
      }

      console.log(`   ✓ All required methods available`);

      // Test language ID mapping
      const languageIds = {
        javascript: 63,
        python: 71,
        java: 62,
        cpp: 54
      };

      for (const [lang, expectedId] of Object.entries(languageIds)) {
        const id = judgeService.default.getLanguageId(lang);
        if (id !== expectedId) {
          throw new Error(`Language ${lang}: expected ${expectedId}, got ${id}`);
        }
      }
      console.log(`   ✓ Language mapping correct`);
    });

    // Test 8: User Submissions
    await this.test('Fetch User Submissions', async () => {
      const response = await this.request('/problems/user/submissions');
      if (!Array.isArray(response)) throw new Error('Invalid response format');
      console.log(`   Total submissions: ${response.length}`);
    });

    // Test 9: Authentication Token Validation
    await this.test('Validate Auth Token', async () => {
      if (!this.token) throw new Error('No token available');
      
      // Try accessing a protected endpoint without token
      try {
        await fetch(`${API_URL}/problems/user/submissions`);
        throw new Error('Should have been unauthorized');
      } catch (e) {
        if (e.message === 'Should have been unauthorized') throw e;
        // Expected to fail without token
        console.log(`   ✓ Protected endpoint rejects unauthorized requests`);
      }
    });

    // Test 10: JSON Validation
    await this.test('Validate Jolly Problem JSON', async () => {
      const jsonPath = './jolly-problem.json';
      if (!fs.existsSync(jsonPath)) {
        throw new Error('jolly-problem.json not found');
      }

      const content = fs.readFileSync(jsonPath, 'utf8');
      const problem = JSON.parse(content);

      if (!problem.title) throw new Error('Missing title');
      if (!problem.starter_code) throw new Error('Missing starter_code');

      const starterCode = JSON.parse(problem.starter_code);
      const languages = Object.keys(starterCode);
      console.log(`   ✓ JSON valid`);
      console.log(`   ✓ Starter code languages: ${languages.join(', ')}`);
    });

    // Summary
    console.log('\n\n📊 Test Results');
    console.log('================');
    console.log(`✅ Passed: ${this.testsPassed}`);
    console.log(`❌ Failed: ${this.testsFailed}`);
    console.log(`📈 Total:  ${this.testsPassed + this.testsFailed}`);

    if (this.testsFailed === 0) {
      console.log('\n🎉 All tests passed!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some tests failed.');
      process.exit(1);
    }
  }
}

// Run tests
const tester = new CodeMasteryTester();
tester.run().catch(error => {
  console.error('Test suite error:', error);
  process.exit(1);
});

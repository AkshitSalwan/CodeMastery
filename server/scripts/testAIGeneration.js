import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Test configuration
const API_BASE = 'http://localhost:4000/api';
const TEST_TIMEOUT = 30000; // 30 seconds for AI generation

// Mock auth token - in real scenario, get from login
const getAuthToken = () => {
  // For testing, we're assuming the user is authenticated
  // In production, you'd get this from login endpoint
  return 'test-token';
};

// Helper to make API calls
const apiCall = async (method, endpoint, body = null, authToken = null) => {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: TEST_TIMEOUT,
  };

  if (authToken) {
    options.headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    return {
      status: response.status,
      statusText: response.statusText,
      data,
      ok: response.ok
    };
  } catch (error) {
    return {
      status: 0,
      statusText: 'Network Error',
      data: null,
      error: error.message,
      ok: false
    };
  }
};

// Test payloads
const testPayloads = [
  {
    name: 'Two Sum Problem',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to the target.',
    difficulty: 'Easy',
    constraints: ['2 <= nums.length <= 104', '-109 <= nums[i] <= 109', '-109 <= target <= 109']
  },
  {
    name: 'Reverse String Problem',
    title: 'Reverse String',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
    difficulty: 'Easy',
    constraints: ['1 <= s.length <= 105', 's[i] is a printable ascii character']
  },
  {
    name: 'Longest Substring Problem',
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'Medium',
    constraints: ['0 <= s.length <= 5 * 104', 's consists of English letters, digits, symbols and spaces.']
  }
];

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
  json: (obj) => console.log(JSON.stringify(obj, null, 2)),
};

// Main test function
async function runTests() {
  log.title('🧪 AI Generation Endpoints Test Suite');
  log.info(`Testing API at: ${API_BASE}`);
  log.info(`Test Timeout: ${TEST_TIMEOUT / 1000}s\n`);

  const results = [];

  for (const payload of testPayloads) {
    log.title(`Testing: ${payload.name}`);

    // Test 1: Generate Test Cases
    log.info(`Generating test cases...`);
    const testCasesResponse = await apiCall(
      'POST',
      '/problems/generate-test-cases',
      {
        title: payload.title,
        description: payload.description,
        difficulty: payload.difficulty,
        constraints: payload.constraints
      }
    );

    const testCasesResult = {
      name: payload.name,
      testCases: { ok: false, count: 0, message: '' },
      hints: { ok: false, count: 0, message: '' },
      explanation: { ok: false, length: 0, message: '' },
    };

    if (testCasesResponse.ok) {
      log.success(`Test cases generated successfully`);
      const testCases = testCasesResponse.data.test_cases || [];
      const hiddenTestCases = testCasesResponse.data.hidden_test_cases || [];
      log.info(`  • ${testCases.length} visible test cases`);
      log.info(`  • ${hiddenTestCases.length} hidden test cases`);
      log.info(`  • Total: ${testCases.length + hiddenTestCases.length} test cases`);
      
      testCasesResult.testCases = {
        ok: true,
        count: testCases.length + hiddenTestCases.length,
        message: testCasesResponse.data.message
      };

      // Show sample test case structure
      if (testCases.length > 0) {
        log.info(`  • Sample visible test case:`, );
        log.json(testCases[0]);
      }
      if (hiddenTestCases.length > 0) {
        log.info(`  • Sample hidden test case:`);
        log.json(hiddenTestCases[0]);
      }
    } else {
      log.error(`Failed to generate test cases`);
      log.warn(`Status: ${testCasesResponse.status} ${testCasesResponse.statusText}`);
      if (testCasesResponse.data?.error) {
        log.warn(`Error: ${testCasesResponse.data.error}`);
      }
      if (testCasesResponse.error) {
        log.warn(`Network Error: ${testCasesResponse.error}`);
      }
    }

    // Test 2: Generate Hints
    log.info(`Generating hints...`);
    const hintsResponse = await apiCall(
      'POST',
      '/problems/generate-hints',
      {
        title: payload.title,
        description: payload.description,
        difficulty: payload.difficulty
      }
    );

    if (hintsResponse.ok) {
      log.success(`Hints generated successfully`);
      const hints = hintsResponse.data.hints || [];
      log.info(`  • ${hints.length} hints generated`);
      
      testCasesResult.hints = {
        ok: true,
        count: hints.length,
        message: hintsResponse.data.message
      };

      if (hints.length > 0) {
        log.info(`  • Sample hints:`);
        hints.forEach((hint, idx) => {
          console.log(`    ${idx + 1}. ${hint.substring(0, 80)}${hint.length > 80 ? '...' : ''}`);
        });
      }
    } else {
      log.error(`Failed to generate hints`);
      log.warn(`Status: ${hintsResponse.status} ${hintsResponse.statusText}`);
      if (hintsResponse.data?.error) {
        log.warn(`Error: ${hintsResponse.data.error}`);
      }
    }

    // Test 3: Generate Solution Explanation
    log.info(`Generating solution explanation...`);
    const explanationResponse = await apiCall(
      'POST',
      '/problems/generate-solution',
      {
        title: payload.title,
        description: payload.description,
        difficulty: payload.difficulty
      }
    );

    if (explanationResponse.ok) {
      log.success(`Solution explanation generated successfully`);
      const explanation = explanationResponse.data.explanation || '';
      log.info(`  • Length: ${explanation.length} characters`);
      log.info(`  • Preview: ${explanation.substring(0, 100)}...`);
      
      testCasesResult.explanation = {
        ok: true,
        length: explanation.length,
        message: explanationResponse.data.message
      };
    } else {
      log.error(`Failed to generate solution explanation`);
      log.warn(`Status: ${explanationResponse.status} ${explanationResponse.statusText}`);
      if (explanationResponse.data?.error) {
        log.warn(`Error: ${explanationResponse.data.error}`);
      }
    }

    results.push(testCasesResult);
    console.log('');
  }

  // Summary
  log.title('📊 Test Summary');
  console.table(results);

  // Overall stats
  const totalTests = results.length;
  const passedTestCases = results.filter(r => r.testCases.ok).length;
  const passedHints = results.filter(r => r.hints.ok).length;
  const passedExplanations = results.filter(r => r.explanation.ok).length;

  log.title('Results');
  log.info(`Test Cases: ${passedTestCases}/${totalTests} ✓`);
  log.info(`Hints: ${passedHints}/${totalTests} ✓`);
  log.info(`Explanations: ${passedExplanations}/${totalTests} ✓`);

  const overallPass = passedTestCases === totalTests && passedHints === totalTests && passedExplanations === totalTests;
  if (overallPass) {
    log.success('\nAll tests passed! ✨');
  } else {
    log.error('\nSome tests failed. Please check the output above.');
  }
}

// Run tests
runTests().catch(error => {
  log.error(`Unexpected error: ${error.message}`);
  console.error(error);
  process.exit(1);
});

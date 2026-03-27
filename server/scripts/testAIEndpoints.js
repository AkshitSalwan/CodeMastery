#!/usr/bin/env node

const API_BASE = 'http://localhost:4000/api';

//color helper
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  debug: (msg) => console.log(`${colors.gray}${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
};

// Test credentials
const TEST_USER = {
  email: 'admin@codemastery.com',
  password: 'admin123456',
};

let authToken = null;

async function login() {
  log.info('Attempting to login as admin user...');
  
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_USER),
    });

    const data = await response.json();
    
    if (!response.ok) {
      log.error(`Login failed: ${data.error || response.status}`);
      return false;
    }

    authToken = data.token;
    log.success(`Logged in successfully. Token: ${authToken.substring(0, 20)}...`);
    return true;
  } catch (error) {
    log.error(`Login error: ${error.message}`);
    return false;
  }
}

async function testAIEndpoint(endpoint, payload, name) {
  log.info(`Testing: ${name}`);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      log.error(`${name} failed (${response.status}): ${data.error || 'Unknown error'}`);
      return null;
    }

    log.success(`${name} succeeded`);
    return data;
  } catch (error) {
    log.error(`${name} error: ${error.message}`);
    return null;
  }
}

async function runTests() {
  log.title('🧪 AI Generation Test Suite');

  // Step 1: Login
  if (!await login()) {
    log.error('Cannot proceed without authentication');
    process.exit(1);
  }

  log.title('Testing AI Generation Endpoints');

  const testPayload = {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to the target.',
    difficulty: 'Easy',
    constraints: ['2 <= nums.length <= 104', '-109 <= nums[i] <= 109'],
  };

  // Test test case generation
  log.debug('\n--- Test Case Generation ---');
  const testCasesResult = await testAIEndpoint(
    '/problems/generate-test-cases',
    testPayload,
    'Generate Test Cases'
  );

  if (testCasesResult) {
    log.info(`Visible test cases: ${testCasesResult.test_cases?.length || 0}`);
    log.info(`Hidden test cases: ${testCasesResult.hidden_test_cases?.length || 0}`);
    
    if (testCasesResult.test_cases?.[0]) {
      log.debug(`Sample test case structure:`);
      console.log(JSON.stringify(testCasesResult.test_cases[0], null, 2));
    }
  }

  // Test hints generation
  log.debug('\n--- Hints Generation ---');
  const hintsResult = await testAIEndpoint(
    '/problems/generate-hints',
    {
      title: testPayload.title,
      description: testPayload.description,
      difficulty: testPayload.difficulty,
    },
    'Generate Hints'
  );

  if (hintsResult) {
    log.info(`Hints generated: ${hintsResult.hints?.length || 0}`);
    if (hintsResult.hints?.[0]) {
      log.debug(`First hint: ${hintsResult.hints[0].substring(0, 100)}...`);
    }
  }

  // Test solution explanation generation
  log.debug('\n--- Solution Explanation Generation ---');
  const explanationResult = await testAIEndpoint(
    '/problems/generate-solution',
    {
      title: testPayload.title,
      description: testPayload.description,
      difficulty: testPayload.difficulty,
    },
    'Generate Solution Explanation'
  );

  if (explanationResult) {
    log.info(`Explanation length: ${explanationResult.explanation?.length || 0} characters`);
    if (explanationResult.explanation) {
      log.debug(`Preview: ${explanationResult.explanation.substring(0, 150)}...`);
    }
  }

  log.title('Test Summary');
  const allPassed = testCasesResult && hintsResult && explanationResult;
  
  if (allPassed) {
    log.success('All AI generation tests passed! ✨');
  } else {
    log.warn('Some tests did not complete successfully');
  }

  console.log('');
}

// Run tests
runTests().catch((error) => {
  log.error(`Unexpected error: ${error.message}`);
  console.error(error);
  process.exit(1);
});

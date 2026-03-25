#!/usr/bin/env node

/**
 * End-to-end test for the complete admin question creation workflow
 * with AI-generated test cases, hints, and explanations
 */

const API_BASE = 'http://localhost:4000/api';

// Color helper
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

const TEST_USER = {
  email: 'admin@codemastery.com',
  password: 'admin123456',
};

let authToken = null;

async function login() {
  log.info('Authenticating as admin...');
  
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_USER),
    });

    const data = await response.json();
    
    if (!response.ok) {
      log.error(`Login failed: ${data.error}`);
      return false;
    }

    authToken = data.token;
    log.success(`Authenticated successfully`);
    return true;
  } catch (error) {
    log.error(`Login error: ${error.message}`);
    return false;
  }
}

async function generateAIContent(type, payload) {
  const endpoints = {
    testCases: '/problems/generate-test-cases',
    hints: '/problems/generate-hints',
    explanation: '/problems/generate-solution',
  };

  const endpoint = endpoints[type];
  if (!endpoint) {
    throw new Error(`Unknown AI content type: ${type}`);
  }

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
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to generate ${type}: ${error.message}`);
  }
}

async function createProblem(problemData) {
  log.info(`Creating problem: "${problemData.title}"`);

  try {
    const response = await fetch(`${API_BASE}/problems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(problemData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to create problem: ${error.message}`);
  }
}

async function runWorkflow() {
  log.title('🚀 Admin Problem Creation Workflow (E2E Test)');

  // Step 1: Authenticate
  log.debug('\n[Step 1/6] Authentication');
  if (!await login()) {
    log.error('Cannot proceed without authentication');
    process.exit(1);
  }

  // Step 2: Define problem
  log.debug('\n[Step 2/6] Problem Definition');
  const problemSpec = {
    title: 'Valid Parentheses',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of closing brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: 'easy',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'',
    ],
  };
  
  log.info(`Title: ${problemSpec.title}`);
  log.info(`Difficulty: ${problemSpec.difficulty}`);

  // Step 3: Generate test cases
  log.debug('\n[Step 3/6] AI-Generated Test Cases');
  log.info('Calling Gemini to generate test cases...');
  
  let testCaseData;
  try {
    testCaseData = await generateAIContent('testCases', problemSpec);
    log.success(`Generated ${testCaseData.test_cases?.length || 0} visible + ${testCaseData.hidden_test_cases?.length || 0} hidden test cases`);
  } catch (error) {
    log.error(error.message);
    process.exit(1);
  }

  // Step 4: Generate hints
  log.debug('\n[Step 4/6] AI-Generated Hints');
  log.info('Calling Gemini to generate hints...');
  
  let hintsData;
  try {
    hintsData = await generateAIContent('hints', {
      title: problemSpec.title,
      description: problemSpec.description,
      difficulty: problemSpec.difficulty,
    });
    log.success(`Generated ${hintsData.hints?.length || 0} hints`);
    hintsData.hints?.forEach((hint, idx) => {
      log.debug(`  ${idx + 1}. ${hint.substring(0, 60)}...`);
    });
  } catch (error) {
    log.error(error.message);
    process.exit(1);
  }

  // Step 5: Generate solution explanation
  log.debug('\n[Step 5/6] AI-Generated Solution Explanation');
  log.info('Calling Gemini to generate solution explanation...');
  
  let explanationData;
  try {
    explanationData = await generateAIContent('explanation', {
      title: problemSpec.title,
      description: problemSpec.description,
      difficulty: problemSpec.difficulty,
    });
    log.success(`Generated solution explanation (${explanationData.explanation?.length || 0} chars)`);
  } catch (error) {
    log.error(error.message);
    process.exit(1);
  }

  // Step 6: Create problem with all AI content
  log.debug('\n[Step 6/6] Create Problem with AI Content');
  
  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const slug = generateSlug(problemSpec.title) + '-' + Date.now();
  
  const completeProblem = {
    title: problemSpec.title,
    slug: slug,
    description: problemSpec.description,
    difficulty: 'easy', // Must be lowercase
    constraints: problemSpec.constraints,
    test_cases: testCaseData.test_cases || [],
    hidden_test_cases: testCaseData.hidden_test_cases || [],
    hints: hintsData.hints || [],
    solution_explanation: explanationData.explanation || '',
    starter_code: {
      python: 'def isValid(s):\n    """Solution goes here"""\n    pass',
      javascript: 'function isValid(s) {\n    // Solution goes here\n}',
      java: 'public class Solution {\n    public boolean isValid(String s) {\n        // Solution goes here\n        return false;\n    }\n}',
    },
  };

  try {
    const result = await createProblem(completeProblem);
    log.success(`Problem created successfully!`);
    log.info(`Problem ID: ${result.id || result._id}`);
    log.info(`Slug: ${result.slug}`);
    
    log.title('📊 Problem Summary');
    console.log(`
  Title: ${result.title}
  Difficulty: ${result.difficulty}
  Constraints: ${result.constraints?.length || 0}
  Visible Tests: ${result.test_cases?.length || 0}
  Hidden Tests: ${result.hidden_test_cases?.length || 0}
  Hints: ${result.hints?.length || 0}
  Has Solution Explanation: ${'solution_explanation' in result}
  Has Starter Code: ${Object.keys(result.starter_code || {}).length > 0 ? 'Yes' : 'No'}
    `);
    
    log.success('\n✨ End-to-end workflow completed successfully!');
    
  } catch (error) {
    log.error(error.message);
    process.exit(1);
  }
}

// Run the workflow
runWorkflow().catch((error) => {
  log.error(`Unexpected error: ${error.message}`);
  console.error(error);
  process.exit(1);
});

#!/usr/bin/env node

/**
 * Example Test: Testing the "Search Jolly" Problem
 * Shows how to test submissions for specific problems
 */

const testCases = [
  {
    name: "Test 1: Single word 'jolly'",
    input: "jolly",
    expected: "true",
    description: "Should return true when 'jolly' is in the input"
  },
  {
    name: "Test 2: Single word 'bunts'",
    input: "bunts",
    expected: "biceps",
    description: "Should return 'biceps' when 'bunts' is in the input"
  },
  {
    name: "Test 3: Neither word",
    input: "happy sad",
    expected: "false",
    description: "Should return false when neither word is found"
  },
  {
    name: "Test 4: Multiple words with 'jolly'",
    input: "hello jolly world",
    expected: "true",
    description: "Should find 'jolly' among multiple words"
  },
  {
    name: "Test 5: Multiple 'bunts' words",
    input: "bunts bunts",
    expected: "biceps",
    description: "Should return 'biceps' for multiple 'bunts'"
  },
  {
    name: "Test 6: 'jolly' takes priority",
    input: "jolly bunts",
    expected: "true",
    description: "Should return true (jolly has priority over bunts)"
  }
];

// JavaScript Solution
const jsCheckWords = (arr) => {
  for (let word of arr) {
    if (word === "jolly") return true;
    if (word === "bunts") return "biceps";
  }
  return false;
};

// Python Solution
const pyCheckWords = (arr) => {
  // Simulating Python behavior in JavaScript
  for (let word of arr) {
    if (word === "jolly") return true;
    if (word === "bunts") return "biceps";
  }
  return false;
};

// Java Solution
const javaCheckWords = (arr) => {
  // Simulating Java behavior in JavaScript
  for (let word of arr) {
    if (word === "jolly") return true;
    if (word === "bunts") return "biceps";
  }
  return false;
};

// Run tests
console.log('🧪 Search Jolly - Problem Test Suite\n');
console.log('====================================\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const arr = testCase.input.split(' ');
  const result = jsCheckWords(arr);
  const resultStr = String(result);
  const expectedStr = String(testCase.expected);
  const isPassed = resultStr === expectedStr;

  if (isPassed) {
    passed++;
    console.log(`✅ ${testCase.name}`);
  } else {
    failed++;
    console.log(`❌ ${testCase.name}`);
  }

  console.log(`   Description: ${testCase.description}`);
  console.log(`   Input:    "${testCase.input}"`);
  console.log(`   Expected: ${testCase.expected}`);
  console.log(`   Got:      ${resultStr}`);
  console.log('');
});

console.log('\n📊 Results\n==========');
console.log(`✅ Passed: ${passed}/${testCases.length}`);
console.log(`❌ Failed: ${failed}/${testCases.length}`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! Your solution is correct.\n');
} else {
  console.log('\n⚠️  Some tests failed. Review your solution.\n');
}

// Additional test examples
console.log('\n💡 How to verify your submissions:\n');
console.log('1. Frontend Test (via CodeEditor):');
console.log('   - Write or paste your solution code');
console.log('   - Click "Run Tests" to execute against test cases');
console.log('   - Click "Submit" when all tests pass\n');

console.log('2. API Test (via curl):');
console.log(`   curl -X POST http://localhost:4000/api/problems/run \\`);
console.log(`     -H "Content-Type: application/json" \\`);
console.log(`     -H "Authorization: Bearer YOUR_TOKEN" \\`);
console.log(`     -d '{\n       "language": "javascript",\n       "code": "your code here",\n       "testCases": [\n         {"input": "jolly", "output": "true"},\n         {"input": "bunts", "output": "biceps"}\n       ]\n     }'\n`);

console.log('3. Backend Validation:');
console.log('   - All test cases must pass (100% accuracy)');
console.log('   - Code must execute within time limit (1000ms)');
console.log('   - Memory usage must be within limit (256MB)\n');

console.log('📚 Expected Output Table:\n');
console.log('┌─────────────────────┬──────────┐');
console.log('│ Input               │ Output   │');
console.log('├─────────────────────┼──────────┤');
testCases.slice(0, 3).forEach(tc => {
  const input = tc.input.padEnd(19);
  const output = String(tc.expected).padEnd(8);
  console.log(`│ ${input} │ ${output} │`);
});
console.log('├─────────────────────┼──────────┤');
testCases.slice(3).forEach(tc => {
  const input = tc.input.padEnd(19);
  const output = String(tc.expected).padEnd(8);
  console.log(`│ ${input} │ ${output} │`);
});
console.log('└─────────────────────┴──────────┘');

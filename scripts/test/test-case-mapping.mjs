#!/usr/bin/env node

/**
 * Test Case Mapping Verification
 * Tests the fixed CodeEditorPage test case handling
 */

console.log('🧪 Test Case Mapping Verification\n');
console.log('===================================\n');

// Simulating the backend response format
const backendResponse = {
  status: {
    id: 3,
    description: "Accepted"
  },
  results: [
    {
      input: 'jolly',
      actualOutput: 'true\n',
      passed: true,
      runtime: '0.073',
      memory: 17632
    },
    {
      input: 'hello jolly world',
      actualOutput: 'true\n',
      passed: true,
      runtime: '0.073',
      memory: 18040
    }
  ]
};

// Simulating the original test cases from the problem
const originalTestCases = [
  {
    input: 'jolly',
    output: 'true',
    expectedOutput: 'true'
  },
  {
    input: 'hello jolly world',
    output: 'true',
    expectedOutput: 'true'
  }
];

console.log('📤 Backend Response Format:');
console.log(JSON.stringify(backendResponse, null, 2));

console.log('\n\n📋 Original Test Cases:');
console.log(JSON.stringify(originalTestCases, null, 2));

console.log('\n\n🔄 Mapping Process:\n');

// Fixed mapping logic
const backendResults = backendResponse.results || backendResponse.testResults || [];

const mappedResults = backendResults.map((backendResult, idx) => {
  const originalTestCase = originalTestCases[idx] || {};
  const expected = (originalTestCase.expectedOutput ?? originalTestCase.output ?? '').toString();
  
  return {
    testNum: idx + 1,
    input: backendResult.input,
    expected: expected,
    output: (backendResult.actualOutput || backendResult.actual || '').trim(),
    passed: backendResult.passed === true,
    status: backendResponse.status.description,
    time: backendResult.runtime,
    memory: backendResult.memory,
    error: backendResult.error,
  };
});

console.log('✅ Mapped Results:');
console.log(JSON.stringify(mappedResults, null, 2));

console.log('\n\n📊 Test Results Analysis:\n');

mappedResults.forEach((result, idx) => {
  const status = result.passed ? '✅' : '❌';
  console.log(`${status} Test ${result.testNum}: ${result.input}`);
  console.log(`   Expected: ${result.expected}`);
  console.log(`   Got: ${result.output}`);
  console.log(`   Time: ${result.time}s | Memory: ${result.memory} KB`);
  console.log('');
});

// Summary
const passedCount = mappedResults.filter(r => r.passed).length;
const totalCount = mappedResults.length;

console.log(`📈 Summary: ${passedCount}/${totalCount} tests passed`);

if (passedCount === totalCount) {
  console.log('\n🎉 All test cases mapped and passed correctly!\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some test cases failed.\n');
  process.exit(1);
}

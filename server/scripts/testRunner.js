/**
 * Test Runner - Validates all problem solutions against test cases
 * Run from project root: node server/scripts/testRunner.js
 */

// Test Cases and Solutions
const testCases = {
  1: {
    title: 'Two Sum',
    solution: function twoSum(nums, target) {
      const map = new Map();
      for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
          return [map.get(complement), i];
        }
        map.set(nums[i], i);
      }
      return [];
    },
    tests: [
      { input: [[2,7,11,15], 9], expected: '[0,1]' },
      { input: [[3,2,4], 6], expected: '[1,2]' },
      { input: [[3,3], 6], expected: '[0,1]' },
      { input: [[2,7,11,15,3], 5], expected: '[0,4]' },
      { input: [[-1,0], -1], expected: '[0,1]' },
      { input: [[1000000,2], 1000002], expected: '[0,1]' },
      { input: [[0,4,3,0], 0], expected: '[0,3]' },
      { input: [[-10,-3,-2,0,5,9], -5], expected: '[1,2]' },
      { input: [[-1,-2,-3,-4,-5], -8], expected: '[2,4]' },
      { input: [[1,2,3,4,5,6,7,8,9,10], 19], expected: '[8,9]' },
    ]
  },

  2: {
    title: 'Add Two Numbers',
    solution: function addTwoNumbers(l1, l2) {
      const dummy = new ListNode(0);
      let current = dummy;
      let carry = 0;
      
      while (l1 || l2 || carry) {
        const sum = (l1?.val || 0) + (l2?.val || 0) + carry;
        current.next = new ListNode(sum % 10);
        carry = Math.floor(sum / 10);
        l1 = l1?.next;
        l2 = l2?.next;
        current = current.next;
      }
      
      return dummy.next;
    },
    tests: [
      { input: [[2,4,3], [5,6,4]], expected: [7,0,8], listFormat: true },
      { input: [[0], [0]], expected: [0], listFormat: true },
      { input: [[9,9,9,9,9,9,9], [9,9,9,9]], expected: [8,9,9,9,0,0,0,1], listFormat: true },
      { input: [[9], [1,9,9,9,9,9,9,9,9,9]], expected: [0,0,0,0,0,0,0,0,0,0,1], listFormat: true },
      { input: [[2,4,3], [5,6,4,9]], expected: [7,0,8,9], listFormat: true },
      { input: [[5], [5]], expected: [0,1], listFormat: true },
      { input: [[1,2,3], [4,5,6]], expected: [5,7,9], listFormat: true },
      { input: [[9,9], [1]], expected: [0,0,1], listFormat: true },
      { input: [[1], [2]], expected: [3], listFormat: true },
      { input: [[1,2,3,4], [5,6,7]], expected: [6,8,0,5], listFormat: true },
    ]
  },

  3: {
    title: 'Longest Substring Without Repeating Characters',
    solution: function lengthOfLongestSubstring(s) {
      const charMap = {};
      let maxLen = 0;
      let left = 0;
      
      for (let right = 0; right < s.length; right++) {
        if (charMap[s[right]] >= left) {
          left = charMap[s[right]] + 1;
        }
        charMap[s[right]] = right;
        maxLen = Math.max(maxLen, right - left + 1);
      }
      
      return maxLen;
    },
    tests: [
      { input: "abcabcbb", expected: '3' },
      { input: "bbbbb", expected: '1' },
      { input: "pwwkew", expected: '3' },
      { input: "", expected: '0' },
      { input: "au", expected: '2' },
      { input: "dvdf", expected: '3' },
      { input: "aab", expected: '2' },
      { input: "abcdefghijklmnopqrstuvwxyz", expected: '26' },
      { input: "!@#$%", expected: '5' },
      { input: "a1b2c3a", expected: '6' },
      { input: "ababab", expected: '2' },
      { input: "abcabcabcd", expected: '4' },
      { input: "tmmzuxt", expected: '5' },
      { input: "a", expected: '1' },
      { input: "012 345", expected: '7' },
    ]
  },

  4: {
    title: 'Reverse Integer',
    solution: function reverse(x) {
      const INT_MAX = Math.pow(2, 31) - 1;
      const INT_MIN = Math.pow(-2, 31);
      
      let result = 0;
      let num = Math.abs(x);
      
      while (num !== 0) {
        const digit = num % 10;
        num = Math.floor(num / 10);
        
        if (result > INT_MAX / 10 || (result === INT_MAX / 10 && digit > 7)) {
          return 0;
        }
        result = result * 10 + digit;
      }
      
      return x < 0 ? -result : result;
    },
    tests: [
      { input: 123, expected: '321' },
      { input: -123, expected: '-321' },
      { input: 120, expected: '21' },
      { input: 0, expected: '0' },
      { input: 1534236469, expected: '0' },
      { input: -2147483648, expected: '0' },
      { input: 20, expected: '2' },
      { input: 1, expected: '1' },
      { input: -1, expected: '-1' },
      { input: 100, expected: '1' },
      { input: 1000, expected: '1' },
    ]
  },

  5: {
    title: 'Median of Two Sorted Arrays',
    solution: function findMedianSortedArrays(nums1, nums2) {
      if (nums1.length > nums2.length) {
        return findMedianSortedArrays(nums2, nums1);
      }
      
      let low = 0, high = nums1.length;
      const m = nums1.length;
      const n = nums2.length;
      
      while (low <= high) {
        const cut1 = Math.floor((low + high) / 2);
        const cut2 = Math.floor((m + n + 1) / 2) - cut1;
        
        const left1 = cut1 === 0 ? -Infinity : nums1[cut1 - 1];
        const right1 = cut1 === m ? Infinity : nums1[cut1];
        
        const left2 = cut2 === 0 ? -Infinity : nums2[cut2 - 1];
        const right2 = cut2 === n ? Infinity : nums2[cut2];
        
        if (left1 <= right2 && left2 <= right1) {
          if ((m + n) % 2 === 0) {
            return (Math.max(left1, left2) + Math.min(right1, right2)) / 2;
          } else {
            return Math.max(left1, left2);
          }
        } else if (left1 > right2) {
          high = cut1 - 1;
        } else {
          low = cut1 + 1;
        }
      }
      
      return -1;
    },
    tests: [
      { input: [[1,3], [2]], expected: '2.0' },
      { input: [[1,2], [3,4]], expected: '2.5' },
      { input: [[0,0], [0,0]], expected: '0.0' },
      { input: [[], [1]], expected: '1.0' },
      { input: [[2], []], expected: '2.0' },
      { input: [[1,3,4,6], [2]], expected: '3.0' },
      { input: [[1,2], [1,2]], expected: '1.5' },
      { input: [[1,2,3], [4,5,6]], expected: '3.5' },
      { input: [[1], [2]], expected: '1.5' },
      { input: [[], [1,2]], expected: '1.5' },
      { input: [[1,3], [2,4,5]], expected: '3.0' },
      { input: [[1,2,3,4,5], [6]], expected: '3.5' },
    ]
  }
};

// ListNode helper for linked list problems
function ListNode(val = 0, next = null) {
  this.val = val;
  this.next = next;
}

// Helper to convert array to linked list
function arrayToList(arr) {
  if (!arr || arr.length === 0) return null;
  const head = new ListNode(arr[0]);
  let current = head;
  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }
  return head;
}

// Helper to convert linked list to array
function listToArray(node) {
  const arr = [];
  while (node) {
    arr.push(node.val);
    node = node.next;
  }
  return arr;
}

// Test runner
function runTests() {
  let totalPassed = 0;
  let totalTests = 0;
  const results = [];

  console.log('\n' + '='.repeat(70));
  console.log('🧪 COMPREHENSIVE TEST RUNNER - ALL PROBLEMS');
  console.log('='.repeat(70) + '\n');

  for (const [problemId, problem] of Object.entries(testCases)) {
    console.log(`\n📝 Problem ${problemId}: ${problem.title}`);
    console.log('-'.repeat(70));

    let problemPassed = 0;
    const problemTests = problem.tests.length;

    problem.tests.forEach((testCase, index) => {
      let actual, expected;
      
      try {
        if (problemId === '2') {
          // Convert arrays to linked lists for problem 2
          const [list1, list2] = testCase.input.map(arr => arrayToList(arr));
          actual = listToArray(problem.solution(list1, list2));
          expected = testCase.expected;
        } else if (Array.isArray(testCase.input)) {
          actual = problem.solution(...testCase.input);
          expected = testCase.expected;
        } else {
          actual = problem.solution(testCase.input);
          expected = testCase.expected;
        }

        let passed = false;
        if (typeof expected === 'string' && typeof actual !== 'string') {
          // For number problems like Median with .0
          if (expected.includes('.')) {
            passed = parseFloat(actual).toFixed(1) === expected;
          } else {
            passed = JSON.stringify(actual) === expected;
          }
        } else if (typeof expected === 'string') {
          passed = actual === expected;
        } else {
          passed = JSON.stringify(actual) === JSON.stringify(expected);
        }
        
        if (passed) {
          problemPassed++;
          totalPassed++;
          console.log(`  ✅ Test ${index + 1}: PASSED`);
        } else {
          console.log(`  ❌ Test ${index + 1}: FAILED`);
          console.log(`     Input: ${JSON.stringify(testCase.input)}`);
          console.log(`     Expected: ${JSON.stringify(expected)}`);
          console.log(`     Got: ${JSON.stringify(actual)}`);
        }
      } catch (error) {
        console.log(`  ⚠️  Test ${index + 1}: ERROR`);
        console.log(`     Error: ${error.message}`);
      }

      totalTests++;
    });

    const passPercentage = ((problemPassed / problemTests) * 100).toFixed(1);
    results.push({
      problemId,
      title: problem.title,
      passed: problemPassed,
      total: problemTests,
      percentage: passPercentage
    });

    console.log(`\n  Summary: ${problemPassed}/${problemTests} tests passed (${passPercentage}%)`);
  }

  // Final Summary
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 FINAL TEST SUMMARY');
  console.log('='.repeat(70));

  results.forEach(result => {
    const status = result.percentage === '100.0' ? '✅' : '⚠️';
    console.log(`${status} Problem ${result.problemId}: ${result.title}`);
    console.log(`   ${result.passed}/${result.total} passed (${result.percentage}%)`);
  });

  console.log('\n' + '='.repeat(70));
  const totalPassPercentage = ((totalPassed / totalTests) * 100).toFixed(1);
  console.log(`🎯 OVERALL: ${totalPassed}/${totalTests} tests passed (${totalPassPercentage}%)`);
  console.log('='.repeat(70) + '\n');

  if (totalPassed === totalTests) {
    console.log('🎉 ALL TESTS PASSED! Ready for production deployment.\n');
  }
}

// Run tests
runTests();

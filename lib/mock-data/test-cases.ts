import type { TestResult } from '../../lib/types/problem';

// These are the comprehensive test cases for all problems.
// Each problem includes multiple test cases covering edge cases and different scenarios.
export const mockTestCases: Record<string, TestResult[]> = {
  // Two Sum - Easy
  '1': [
    {
      testNum: 1,
      input: 'nums = [2,7,11,15], target = 9',
      expected: '[0,1]',
      passed: true,
    },
    {
      testNum: 2,
      input: 'nums = [3,2,4], target = 6',
      expected: '[1,2]',
      passed: true,
    },
    {
      testNum: 3,
      input: 'nums = [3,3], target = 6',
      expected: '[0,1]',
      passed: true,
    },
    {
      testNum: 4,
      input: 'nums = [2,7,11,15,3], target = 5',
      expected: '[0,4]',
      passed: true,
    },
    {
      testNum: 5,
      input: 'nums = [-1,0], target = -1',
      expected: '[0,1]',
      passed: true,
    },
    {
      testNum: 6,
      input: 'nums = [1000000,1000000,1000000,1000000], target = -294967296',
      expected: '[]',
      passed: true,
    },
  ],
  
  // Add Two Numbers - Medium
  '2': [
    {
      testNum: 1,
      input: 'l1 = [2,4,3], l2 = [5,6,4]',
      expected: '[7,0,8]',
      passed: true,
    },
    {
      testNum: 2,
      input: 'l1 = [0], l2 = [0]',
      expected: '[0]',
      passed: true,
    },
    {
      testNum: 3,
      input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]',
      expected: '[8,9,9,9,0,0,0,1]',
      passed: true,
    },
    {
      testNum: 4,
      input: 'l1 = [9], l2 = [1,9,9,9,9,9,9,9,9,9]',
      expected: '[0,0,0,0,0,0,0,0,0,0,1]',
      passed: true,
    },
    {
      testNum: 5,
      input: 'l1 = [2,4,3], l2 = [5,6,4,9]',
      expected: '[7,0,8,9]',
      passed: true,
    },
    {
      testNum: 6,
      input: 'l1 = [5], l2 = [5]',
      expected: '[0,1]',
      passed: true,
    },
  ],
  
  // Longest Substring Without Repeating Characters - Medium
  '3': [
    {
      testNum: 1,
      input: 's = "abcabcbb"',
      expected: '3',
      passed: true,
    },
    {
      testNum: 2,
      input: 's = "bbbbb"',
      expected: '1',
      passed: true,
    },
    {
      testNum: 3,
      input: 's = "pwwkew"',
      expected: '3',
      passed: true,
    },
    {
      testNum: 4,
      input: 's = ""',
      expected: '0',
      passed: true,
    },
    {
      testNum: 5,
      input: 's = "au"',
      expected: '2',
      passed: true,
    },
    {
      testNum: 6,
      input: 's = "dvdf"',
      expected: '3',
      passed: true,
    },
    {
      testNum: 7,
      input: 's = "aab"',
      expected: '2',
      passed: true,
    },
  ],
  
  // Reverse Integer - Medium
  '4': [
    {
      testNum: 1,
      input: 'x = 123',
      expected: '321',
      passed: true,
    },
    {
      testNum: 2,
      input: 'x = -123',
      expected: '-321',
      passed: true,
    },
    {
      testNum: 3,
      input: 'x = 120',
      expected: '21',
      passed: true,
    },
    {
      testNum: 4,
      input: 'x = 0',
      expected: '0',
      passed: true,
    },
    {
      testNum: 5,
      input: 'x = 1534236469',
      expected: '0',
      passed: true,
    },
    {
      testNum: 6,
      input: 'x = -2147483648',
      expected: '0',
      passed: true,
    },
    {
      testNum: 7,
      input: 'x = 1000000003',
      expected: '3000000001',
      passed: true,
    },
  ],
  
  // Median of Two Sorted Arrays - Hard
  '5': [
    {
      testNum: 1,
      input: 'nums1 = [1,3], nums2 = [2]',
      expected: '2.0',
      passed: true,
    },
    {
      testNum: 2,
      input: 'nums1 = [1,2], nums2 = [3,4]',
      expected: '2.5',
      passed: true,
    },
    {
      testNum: 3,
      input: 'nums1 = [0,0], nums2 = [0,0]',
      expected: '0.0',
      passed: true,
    },
    {
      testNum: 4,
      input: 'nums1 = [], nums2 = [1]',
      expected: '1.0',
      passed: true,
    },
    {
      testNum: 5,
      input: 'nums1 = [2], nums2 = []',
      expected: '2.0',
      passed: true,
    },
    {
      testNum: 6,
      input: 'nums1 = [1,3,4,6], nums2 = [2]',
      expected: '3.0',
      passed: true,
    },
  ],
  
  // Palindrome Number - Easy
  '6': [
    {
      testNum: 1,
      input: 'x = 121',
      expected: 'true',
      passed: true,
    },
    {
      testNum: 2,
      input: 'x = -121',
      expected: 'false',
      passed: true,
    },
    {
      testNum: 3,
      input: 'x = 10',
      expected: 'false',
      passed: true,
    },
    {
      testNum: 4,
      input: 'x = 0',
      expected: 'true',
      passed: true,
    },
    {
      testNum: 5,
      input: 'x = 12321',
      expected: 'true',
      passed: true,
    },
    {
      testNum: 6,
      input: 'x = 1221',
      expected: 'true',
      passed: true,
    },
    {
      testNum: 7,
      input: 'x = 1001',
      expected: 'true',
      passed: true,
    },
  ],
  
  // Valid Parentheses - Easy
  '9': [
    {
      testNum: 1,
      input: '()',
      expected: 'true',
      passed: true,
    },
    {
      testNum: 2,
      input: '(]',
      expected: 'false',
      passed: true,
    },
    {
      testNum: 3,
      input: '{[]}',
      expected: 'true',
      passed: true,
    },
    {
      testNum: 4,
      input: '([)]',
      expected: 'false',
      passed: true,
    },
    {
      testNum: 5,
      input: '',
      expected: 'true',
      passed: true,
    },
    {
      testNum: 6,
      input: '([{}])',
      expected: 'true',
      passed: true,
    },
    {
      testNum: 7,
      input: '{]',
      expected: 'false',
      passed: true,
    },
  ],
};

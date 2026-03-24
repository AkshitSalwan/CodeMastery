import type { TestResult } from '../../lib/types/problem';

// These are the sample test cases shown to users while practicing.
// We intentionally keep this small (1-2 cases) to match the "visible" test case experience.
export const mockTestCases: Record<string, TestResult[]> = {
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
  ],
  '2': [
    {
      testNum: 1,
      input: 'l1 = [2,4,3], l2 = [5,6,4]',
      expected: '[7,0,8]',
      passed: false,
      actual: '[]',
    },
  ],
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
  ],
};

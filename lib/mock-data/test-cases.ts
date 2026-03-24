import type { TestResult } from '../../lib/types/problem';

export const mockTestCases: Record<string, TestResult[]> = {
  '1': [
    {
      testNum: 1,
      input: '2 7 11 15\n9',
      expected: '[0,1]',
      passed: true,
    },
    {
      testNum: 2,
      input: '3 2 4\n6',
      expected: '[1,2]',
      passed: true,
    },
  ],
};
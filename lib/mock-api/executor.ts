import type { Language, Submission, TestResult } from '../../lib/types/problem';
import { mockTestCases } from '../../lib/mock-data/test-cases';

type ExecutionResult = {
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error';
  runtime?: number;
  memory?: number;
  testResults: TestResult[];
  totalTests: number;
  passedTests: number;
};

export async function executeCode(
  code: string,
  language: Language,
  problemId: string,
  isSubmit: boolean = false
): Promise<ExecutionResult> {
  // Simulate execution delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

  if (!code || code.trim().length === 0) {
    return {
      status: 'Compilation Error',
      testResults: [],
      totalTests: 0,
      passedTests: 0,
    };
  }

  const testCases = mockTestCases[problemId] || [];

  // Mock execution - randomly determine outcome
  const outcomes = ['Accepted', 'Wrong Answer', 'Compilation Error'] as const;
  const randomOutcome = isSubmit ? 'Accepted' : outcomes[Math.floor(Math.random() * outcomes.length)];

  // If running only sample tests (not submit), show mixed results for realism
  let testResults: TestResult[] = testCases.map((tc) => ({
    ...tc,
    passed: Math.random() > 0.3, // 70% pass rate for sample tests
  }));

  // If submitting, all tests should pass for accepted
  if (isSubmit && randomOutcome === 'Accepted') {
    testResults = testCases.map((tc) => ({
      ...tc,
      passed: true,
    }));
  } else if (isSubmit) {
    // Some tests fail for wrong answer
    testResults = testCases.map((tc, idx) => ({
      ...tc,
      passed: idx !== Math.floor(Math.random() * testCases.length),
      actual: Math.random() > 0.5 ? tc.expected : 'different_output',
    }));
  }

  const passedTests = testResults.filter((t) => t.passed).length;

  return {
    status: randomOutcome,
    runtime: Math.floor(Math.random() * 100) + 10, // 10-110ms
    memory: Math.floor(Math.random() * 30) + 20, // 20-50MB
    testResults,
    totalTests: testCases.length,
    passedTests,
  };
}

export function createSubmission(
  userId: string,
  problemId: string,
  code: string,
  language: Language,
  status: string,
  runtime?: number,
  memory?: number,
  testResults?: TestResult[]
): Submission {
  return {
    id: `submission-${Date.now()}`,
    userId,
    problemId,
    code,
    language,
    status: status as any,
    runtime,
    memory,
    submittedAt: new Date(),
    testResults: testResults || [],
  };
}

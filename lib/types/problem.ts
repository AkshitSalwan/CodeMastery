export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Language = 'javascript' | 'python' | 'java' | 'cpp';

export type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string[];
  acceptanceRate: number;
  submissions: number;
  companies: string[];
  constraints: string[];
  examples: Example[];
  starterCode: Record<Language, string>;
  hints: string[];
  explanation: string;
  createdBy?: string;
  createdAt?: Date;
  rating: number;
  ratingCount: number;
};

export type Example = {
  input: string;
  output: string;
  explanation: string;
};

export type Submission = {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: Language;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error';
  runtime?: number;
  memory?: number;
  submittedAt: Date;
  testResults: TestResult[];
};

export type TestResult = {
  testNum: number;
  input: string;
  expected: string;
  actual?: string;
  passed: boolean;
  error?: string;
};

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TestResult } from '@/lib/types/problem';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type ExecutionOutputProps = {
  status: string;
  runtime?: number;
  memory?: number;
  testResults: TestResult[];
  totalTests: number;
  passedTests: number;
};

export function ExecutionOutput({
  status,
  runtime,
  memory,
  testResults,
  totalTests,
  passedTests,
}: ExecutionOutputProps) {
  const statusConfig = {
    'Accepted': { color: 'bg-green-500/20 text-green-700 dark:text-green-400', icon: CheckCircle },
    'Wrong Answer': { color: 'bg-red-500/20 text-red-700 dark:text-red-400', icon: XCircle },
    'Compilation Error': { color: 'bg-orange-500/20 text-orange-700 dark:text-orange-400', icon: AlertCircle },
    'Time Limit Exceeded': { color: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400', icon: AlertCircle },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config?.icon || AlertCircle;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            Execution Result
          </CardTitle>
          <Badge className={config?.color}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Info */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Tests Passed</p>
            <p className="text-2xl font-bold text-accent">{passedTests}/{totalTests}</p>
          </div>
          {runtime !== undefined && (
            <div>
              <p className="text-sm text-muted-foreground">Runtime</p>
              <p className="text-2xl font-bold text-foreground">{runtime}ms</p>
            </div>
          )}
          {memory !== undefined && (
            <div>
              <p className="text-sm text-muted-foreground">Memory</p>
              <p className="text-2xl font-bold text-foreground">{memory}MB</p>
            </div>
          )}
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Test Cases</p>
            <div className="space-y-2">
              {testResults.map((result) => (
                <div
                  key={result.testNum}
                  className="p-3 rounded-lg border border-border bg-secondary/30 dark:bg-secondary/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      Test Case {result.testNum}
                    </span>
                    {result.passed ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">✓ Passed</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-medium">✗ Failed</span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs font-mono text-muted-foreground">
                    <p><span className="font-bold">Input:</span> {result.input}</p>
                    <p><span className="font-bold">Expected:</span> {result.expected}</p>
                    {result.actual && !result.passed && (
                      <p className="text-red-600 dark:text-red-400">
                        <span className="font-bold">Actual:</span> {result.actual}
                      </p>
                    )}
                    {result.error && (
                      <p className="text-red-600 dark:text-red-400">
                        <span className="font-bold">Error:</span> {result.error}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

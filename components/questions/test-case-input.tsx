'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';

interface TestCase {
  id: string;
  input: string;
  output: string;
  explanation: string;
}

interface TestCaseInputProps {
  testCases: TestCase[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof TestCase, value: string) => void;
  onRemove: (id: string) => void;
}

export function TestCaseInput({
  testCases,
  onAdd,
  onUpdate,
  onRemove,
}: TestCaseInputProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Test Cases</h3>
        <Button onClick={onAdd} size="sm">
          Add Test Case
        </Button>
      </div>

      {testCases.map((tc) => (
        <Card key={tc.id}>
          <CardContent className="p-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Input
              </label>
              <Textarea
                placeholder="Enter test case input"
                value={tc.input}
                onChange={(e) => onUpdate(tc.id, 'input', e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Expected Output
              </label>
              <Textarea
                placeholder="Enter expected output"
                value={tc.output}
                onChange={(e) => onUpdate(tc.id, 'output', e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Explanation (Optional)
              </label>
              <Textarea
                placeholder="Explain this test case"
                value={tc.explanation}
                onChange={(e) => onUpdate(tc.id, 'explanation', e.target.value)}
                className="text-sm"
              />
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove(tc.id)}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Test Case
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

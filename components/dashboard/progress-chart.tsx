'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import type { UserStats } from '../../lib/types/user';

type ProgressChartProps = {
  stats: UserStats;
};

export function ProgressChart({ stats }: ProgressChartProps) {
  const total = stats.easySolved + stats.mediumSolved + stats.hardSolved;
  const difficulties = [
    { label: 'Easy', value: stats.easySolved, color: 'bg-green-500', percent: (stats.easySolved / total) * 100 },
    { label: 'Medium', value: stats.mediumSolved, color: 'bg-yellow-500', percent: (stats.mediumSolved / total) * 100 },
    { label: 'Hard', value: stats.hardSolved, color: 'bg-red-500', percent: (stats.hardSolved / total) * 100 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress by Difficulty</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {difficulties.map((diff) => (
          <div key={diff.label}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">{diff.label}</span>
              <span className="text-sm text-muted-foreground">
                {diff.value} ({diff.percent.toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${diff.color} transition-all`}
                style={{ width: `${diff.percent}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

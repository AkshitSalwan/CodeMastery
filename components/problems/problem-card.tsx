'use client';

import Link from 'next/link';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { BookmarkButton } from '../../components/bookmark-button';
import type { Problem } from '../../lib/types/problem';
import { ArrowRight } from 'lucide-react';

type ProblemCardProps = {
  problem: Problem;
  solved?: boolean;
};

export function ProblemCard({ problem, solved }: ProblemCardProps) {
  const difficultyColor = {
    Easy: 'bg-green-500/20 text-green-700 dark:text-green-400',
    Medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    Hard: 'bg-red-500/20 text-red-700 dark:text-red-400',
  };

  return (
    <Card className="hover:border-accent transition-colors cursor-pointer h-full overflow-hidden group">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/problems/${problem.id}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-accent transition-colors">
              {problem.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {problem.description.substring(0, 100)}...
            </p>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            {solved && <div className="text-xl">✓</div>}
            <BookmarkButton problemId={problem.id} size="sm" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={difficultyColor[problem.difficulty]}>
            {problem.difficulty}
          </Badge>
          {problem.companies.slice(0, 2).map((company) => (
            <Badge key={company} variant="secondary" className="text-xs">
              {company}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
          <span>{problem.acceptanceRate.toFixed(1)}% acceptance</span>
          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardContent>
    </Card>
  );
}

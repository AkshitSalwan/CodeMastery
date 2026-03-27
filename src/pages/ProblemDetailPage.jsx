import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { problems } from '../data/problems';
import { Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ProblemDetailPage() {
  const { id } = useParams();
  const problem = problems.find(p => p.id === id);
  const { isProblemSolved } = useAuth();

  if (!problem) {
    return <div className="text-center py-12">Problem not found</div>;
  }

  const difficultyColor = {
    Easy: 'bg-green-500/20 text-green-700 dark:text-green-400',
    Medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    Hard: 'bg-red-500/20 text-red-700 dark:text-red-400',
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{problem.title}</h1>
          <div className="flex gap-2 items-center flex-wrap">
            {isProblemSolved(problem.id) ? (
              <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                Solved
              </Badge>
            ) : null}
            <Badge variant="outline" className={difficultyColor[problem.difficulty]}>
              {problem.difficulty}
            </Badge>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(problem.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({problem.ratingCount})</span>
            </div>
          </div>
        </div>
        <Link to={`/problems/${problem.id}/editor`}>
          <Button>
            {isProblemSolved(problem.id) ? 'Review Solution' : 'Solve Problem'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">{problem.description}</p>

          {problem.constraints.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Constraints</h3>
              <ul className="list-disc list-inside space-y-1">
                {problem.constraints.map((constraint, idx) => (
                  <li key={idx} className="text-muted-foreground">
                    {constraint}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {problem.examples.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Examples</h3>
              {problem.examples.map((example, idx) => (
                <div key={idx} className="bg-secondary/50 p-4 rounded-lg mb-3">
                  <p className="font-mono text-foreground font-semibold">Example {idx + 1}:</p>
                  <p className="font-mono text-foreground mt-2">Input: {example.input}</p>
                  <p className="font-mono text-foreground mt-1">Output: {example.output}</p>
                  {example.explanation && (
                    <p className="text-muted-foreground mt-2">Explanation: {example.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {problem.hints.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Hints</h3>
              {problem.hints.map((hint, idx) => (
                <div key={idx} className="text-muted-foreground p-3 bg-secondary/30 rounded mb-2">
                  <strong>Hint {idx + 1}:</strong> {hint}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Explanation */}
      {problem.explanation && (
        <Card>
          <CardHeader>
            <CardTitle>Optimal Approach</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{problem.explanation}</p>
          </CardContent>
        </Card>
      )}

      {/* Companies */}
      {problem.companies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Asked in Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {problem.companies.map((company) => (
                <Badge key={company} variant="secondary">
                  {company}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Acceptance Rate</p>
            <p className="text-2xl font-bold text-foreground">{problem.acceptanceRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Submissions</p>
            <p className="text-2xl font-bold text-foreground">{(problem.submissions / 1000000).toFixed(1)}M</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

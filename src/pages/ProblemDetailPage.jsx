import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { problems } from '../data/problems';
import { Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ProblemDetailPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isProblemSolved } = useAuth();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        // First try API
        const response = await fetch(`/api/problems/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProblem(data.problem || data);
        } else {
          // Fall back to static problems
          const staticProblem = problems.find(p => String(p.id) === String(id));
          setProblem(staticProblem);
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
        // Fall back to static problems
        const staticProblem = problems.find(p => String(p.id) === String(id));
        setProblem(staticProblem);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Loading problem...</div>;
  }

  if (!problem) {
    return <div className="text-center py-12">Problem not found</div>;
  }

  const difficultyColor = {
    Easy: 'bg-green-500/20 text-green-700 dark:text-green-400',
    Medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    Hard: 'bg-red-500/20 text-red-700 dark:text-red-400',
  };

  // Normalize data to handle both API and static formats
  const toArray = (value) => {
    if (Array.isArray(value)) {
      return value;
    }
    if (value == null || value === '') {
      return [];
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (error) {
        return value
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }
    return [];
  };

  const constraints = toArray(problem.constraints);
  const examples = toArray(problem.examples);
  const hints = toArray(problem.hints);
  const companies = toArray(problem.companies);
  const acceptanceRate = problem.acceptanceRate ?? problem.acceptance_rate ?? null;
  const submissions = problem.submissions ?? null;
  const rating = problem.rating ?? null;
  const ratingCount = problem.ratingCount ?? problem.rating_count ?? 0;

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
            {rating !== null && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({ratingCount})</span>
              </div>
            )}
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

          {constraints.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Constraints</h3>
              <ul className="list-disc list-inside space-y-1">
                {constraints.map((constraint, idx) => (
                  <li key={idx} className="text-muted-foreground">
                    {constraint}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {examples.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Examples</h3>
              {examples.map((example, idx) => (
                <div key={idx} className="bg-secondary/50 p-4 rounded-lg mb-3">
                  <p className="font-mono text-foreground font-semibold">Example {idx + 1}:</p>
                  <p className="font-mono text-foreground mt-2">Input: {example.input}</p>
                  <p className="font-mono text-foreground mt-1">Output: {example.output || example.expected_output}</p>
                  {example.explanation && (
                    <p className="text-muted-foreground mt-2">Explanation: {example.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {hints.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Hints</h3>
              {hints.map((hint, idx) => (
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
      {companies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Asked in Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {companies.map((company) => (
                <Badge key={company} variant="secondary">
                  {company}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {(acceptanceRate !== null || submissions !== null) && (
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {acceptanceRate !== null && (
              <div>
                <p className="text-sm text-muted-foreground">Acceptance Rate</p>
                <p className="text-2xl font-bold text-foreground">{typeof acceptanceRate === 'number' ? acceptanceRate.toFixed(1) : acceptanceRate}%</p>
              </div>
            )}
            {submissions !== null && (
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold text-foreground">{(submissions / 1000000).toFixed(1)}M</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

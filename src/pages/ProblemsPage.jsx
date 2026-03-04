import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { BookmarkButton } from "../../components/bookmark-button";
import { problems as defaultProblems } from '../data/problems';

export function ProblemsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [customQuestions, setCustomQuestions] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('customQuestions');
    if (stored) {
      setCustomQuestions(JSON.parse(stored));
    }
  }, []);

  const allProblems = [...defaultProblems, ...customQuestions];

  const difficultyColor = {
    Easy: 'bg-green-500/20 text-green-700 dark:text-green-400',
    Medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    Hard: 'bg-red-500/20 text-red-700 dark:text-red-400',
  };

  const filtered = allProblems.filter(
    (problem) => {
      const categories = Array.isArray(problem.category) ? problem.category : (problem.category ? [problem.category] : []);
      return (
        ((problem.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (problem.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())) &&
        (filterDifficulty === 'All' || problem.difficulty === filterDifficulty) &&
        (filterCategory === 'All' || categories.includes(filterCategory))
      );
    }
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Problems</h1>
        <p className="text-muted-foreground">Solve {allProblems.length} amazing DSA problems</p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground"
        />
        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="text-sm text-muted-foreground">Difficulty</label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="mt-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option>All</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="mt-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option>All</option>
              <option>Array</option>
              <option>String</option>
              <option>Linked List</option>
              <option>Hash Table</option>
              <option>Math</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid gap-4">
        {filtered.map((problem) => (
          <Card key={problem.id} className="hover:border-accent transition-colors">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <Link to={`/problems/${problem.id}`} className="flex-1">
                  <h3 className="font-semibold text-foreground hover:text-accent transition-colors">
                    {problem.title || 'Untitled'}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {((problem.description || '').substring(0, 100)) || '—'}...
                  </p>
                </Link>
                <BookmarkButton problemId={problem.id} />
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={difficultyColor[problem.difficulty]}>
                  {problem.difficulty}
                </Badge>
                {(problem.companies || []).slice(0, 2).map((company) => (
                  <Badge key={company} variant="secondary" className="text-xs">
                    {company}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                <span>{problem.acceptanceRate ? `${problem.acceptanceRate.toFixed(1)}%` : '—'} acceptance</span>
                <div className="flex items-center gap-2">
                  <Link to={`/problems/${problem.id}/editor`}>
                    <Button size="sm" variant="outline">
                      Solve
                    </Button>
                  </Link>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">No problems found matching your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

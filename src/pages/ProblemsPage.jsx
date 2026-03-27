import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { CheckCircle2, Edit, Trash2 } from 'lucide-react';
import { BookmarkButton } from "../components/BookmarkButton";
import { useAuth } from '../context/AuthContext';

export function ProblemsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [apiProblems, setApiProblems] = useState([]);
  const [customQuestions, setCustomQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isProblemSolved } = useAuth();
  const isInterviewer = user?.role === 'interviewer';

  // Fetch problems from API
  const fetchProblems = async () => {
    try {
      console.log('Fetching problems from API...');
      const response = await fetch('/api/problems', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched problems:', data);
        setApiProblems(data.problems || []);
      } else {
        console.error('Failed to fetch problems from API. Status:', response.status);
        setApiProblems([]);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      setApiProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomQuestions = () => {
    const stored = localStorage.getItem('customQuestions');
    if (stored) {
      setCustomQuestions(JSON.parse(stored));
    } else {
      setCustomQuestions([]);
    }
  };

  const deleteCustomQuestion = (id) => {
    const updated = customQuestions.filter(q => q.id !== id);
    setCustomQuestions(updated);
    localStorage.setItem('customQuestions', JSON.stringify(updated));
  };

  const editCustomQuestion = (id) => {
    navigate(`/add-question?edit=${id}`);
  };

  useEffect(() => {
    fetchProblems();
    loadCustomQuestions();
    window.addEventListener('focus', () => {
      fetchProblems();
      loadCustomQuestions();
    });
    return () => window.removeEventListener('focus', () => {});
  }, []);

  // Combine API problems with any custom questions from localStorage
  const allProblems = [...apiProblems, ...customQuestions];

  const difficultyColor = {
    Easy: 'bg-green-500/20 text-green-700 dark:text-green-400',
    Medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    Hard: 'bg-red-500/20 text-red-700 dark:text-red-400',
  };

  const difficultyRank = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
  };

  const getAcceptanceRate = (problem) => {
    const value = problem.acceptanceRate ?? problem.acceptance_rate ?? null;
    if (value == null || value === '') {
      return null;
    }

    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  };

  const filtered = allProblems.filter(
    (problem) => {
      // Handle both category (static) and tags (API) fields
      const categories = problem.category 
        ? (Array.isArray(problem.category) ? problem.category : [problem.category])
        : (problem.tags ? (Array.isArray(problem.tags) ? problem.tags : [problem.tags]) : []);
      
      return (
        ((problem.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (problem.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())) &&
        (filterDifficulty === 'All' || problem.difficulty === filterDifficulty) &&
        (filterCategory === 'All' || categories.includes(filterCategory))
      );
    }
  );

  const sortedProblems = [...filtered].sort((left, right) => {
    switch (sortBy) {
      case 'title':
        return String(left.title || '').localeCompare(String(right.title || ''));
      case 'difficulty-asc':
        return (difficultyRank[left.difficulty] || 99) - (difficultyRank[right.difficulty] || 99);
      case 'difficulty-desc':
        return (difficultyRank[right.difficulty] || 99) - (difficultyRank[left.difficulty] || 99);
      case 'acceptance-desc':
        return (getAcceptanceRate(right) ?? -1) - (getAcceptanceRate(left) ?? -1);
      case 'acceptance-asc':
        return (getAcceptanceRate(left) ?? 101) - (getAcceptanceRate(right) ?? 101);
      case 'oldest':
        return new Date(left.created_at || left.createdAt || 0).getTime() - new Date(right.created_at || right.createdAt || 0).getTime();
      case 'newest':
      default:
        return new Date(right.created_at || right.createdAt || 0).getTime() - new Date(left.created_at || left.createdAt || 0).getTime();
    }
  });

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
          <div>
            <label className="text-sm text-muted-foreground">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="mt-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A-Z</option>
              <option value="difficulty-asc">Difficulty: Easy to Hard</option>
              <option value="difficulty-desc">Difficulty: Hard to Easy</option>
              <option value="acceptance-desc">Acceptance: High to Low</option>
              <option value="acceptance-asc">Acceptance: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid gap-4">
        {sortedProblems.map((problem) => (
          <Card
            key={problem.id}
            className="rounded-2xl border-border/70 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md"
          >
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <Link to={`/problems/${problem.id}`} className="min-w-0 flex-1 space-y-1">
                  <h3 className="text-lg font-semibold text-foreground hover:text-accent transition-colors">
                    {problem.title || 'Untitled'}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {((problem.description || '').substring(0, 100)) || '—'}...
                  </p>
                </Link>
                <BookmarkButton problemId={problem.id} />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {isProblemSolved(problem.id) ? (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Solved
                  </Badge>
                ) : null}
                <Badge variant="outline" className={difficultyColor[problem.difficulty]}>
                  {problem.difficulty}
                </Badge>
                
                {/* Display companies if available (for static problems) */}
                {(problem.companies || []).slice(0, 2).map((company) => (
                  <Badge key={company} variant="secondary" className="text-xs">
                    {company}
                  </Badge>
                ))}
                
                {/* Display tags/category if available (for API problems) */}
                {(problem.tags || problem.category || []).slice(0, 2).map((tag) => {
                  const tagLabel = typeof tag === 'string' ? tag : tag.name || tag;
                  return (
                    <Badge key={tagLabel} variant="secondary" className="text-xs">
                      {tagLabel}
                    </Badge>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4 text-sm text-muted-foreground">
                <span>{getAcceptanceRate(problem) != null ? `${getAcceptanceRate(problem).toFixed(1)}%` : '-'} acceptance</span>
                <div className="flex items-center gap-2">
                  <Link to={`/problems/${problem.id}/editor`}>
                    <Button size="sm" variant="outline">
                      {isProblemSolved(problem.id) ? 'Review' : 'Solve'}
                    </Button>
                  </Link>
                  {problem.isCustom && isInterviewer && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => editCustomQuestion(problem.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteCustomQuestion(problem.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedProblems.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">No problems found matching your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

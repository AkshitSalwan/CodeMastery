import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';

export function TopicDetailPage() {
  const { topic } = useParams();
  const decodedTopic = decodeURIComponent(topic);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const difficultyColor = {
    easy: 'bg-green-500/20 text-green-700 dark:text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    hard: 'bg-red-500/20 text-red-700 dark:text-red-400',
    Easy: 'bg-green-500/20 text-green-700 dark:text-green-400',
    Medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    Hard: 'bg-red-500/20 text-red-700 dark:text-red-400',
  };

  // Topic slug to name mapping for API queries
  const topicSlugMap = {
    'arrays': { slug: 'arrays', id: 1 },
    'linked-lists': { slug: 'linked-lists', id: 2 },
    'trees': { slug: 'trees', id: 3 },
    'graphs': { slug: 'graphs', id: 4 },
    'dynamic-programming': { slug: 'dynamic-programming', id: 5 },
    'javascript': { slug: 'javascript', id: 6 },
    'react': { slug: 'react', id: 7 },
    'system-design': { slug: 'system-design', id: 8 },
    'strings': { slug: 'strings', id: 9 },
    'sorting': { slug: 'sorting', id: 10 },
    'hash-tables': { slug: 'hash-tables', id: 11 },
    'stacks-queues': { slug: 'stacks-queues', id: 12 },
  };

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const topicSlug = decodedTopic.toLowerCase().replace(/\s+/g, '-');
        const topicInfo = topicSlugMap[topicSlug];
        
        if (!topicInfo) {
          setError('Topic not found');
          setProblems([]);
          return;
        }

        // Fetch problems by topic ID from API
        const response = await fetch(`/api/problems?topic=${topicInfo.id}`);
        const data = await response.json();
        
        if (data.problems && Array.isArray(data.problems)) {
          setProblems(data.problems);
        } else {
          setProblems([]);
        }
      } catch (err) {
        console.error('Error fetching problems:', err);
        setError('Failed to load problems');
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [decodedTopic]);

  const topicProblems = problems;

  const filtered = topicProblems.filter(
    (problem) =>
      (problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterDifficulty === 'All' || problem.difficulty.toLowerCase() === filterDifficulty.toLowerCase())
  );

  if (error) {
    return (
      <div className="space-y-6">
        <Link to="/topics" className="text-sm text-accent hover:underline">
          &larr; Back to topics
        </Link>
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {decodedTopic}
          </h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${topicProblems.length} problems in this topic`}
          </p>
        </div>
        <Link to="/topics" className="text-sm text-accent hover:underline">
          &larr; Back to topics
        </Link>
      </div>

      {!loading && (
        <>
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
                  <option>easy</option>
                  <option>medium</option>
                  <option>hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Problem list */}
          <div className="grid gap-4">
            {filtered.length > 0 ? (
              filtered.map((problem) => (
                <Card key={problem.id} className="hover:border-accent transition-colors">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/problems/${problem.id}`} className="flex-1">
                        <h3 className="font-semibold text-foreground hover:text-accent transition-colors">
                          {problem.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {problem.description?.substring(0, 100)}...
                        </p>
                      </Link>
                      <Badge variant="outline" className={difficultyColor[problem.difficulty]}>
                        {problem.difficulty}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-muted-foreground">No problems found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {loading && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">Loading problems...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

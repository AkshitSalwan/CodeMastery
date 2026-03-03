import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { problems as defaultProblems } from '../data/problems';

export function TopicDetailPage() {
  const { topic } = useParams();
  const decodedTopic = decodeURIComponent(topic);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  const difficultyColor = {
    Easy: 'bg-green-500/20 text-green-700 dark:text-green-400',
    Medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    Hard: 'bg-red-500/20 text-red-700 dark:text-red-400',
  };

  // filter problems by category matching the topic name
  const topicProblems = defaultProblems.filter(p =>
    p.category.some(c => c.toLowerCase() === decodedTopic.toLowerCase())
  );

  const filtered = topicProblems.filter(
    (problem) =>
      (problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterDifficulty === 'All' || problem.difficulty === filterDifficulty)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {decodedTopic}
          </h1>
          <p className="text-muted-foreground">
            {topicProblems.length} problems in this topic
          </p>
        </div>
        <Link to="/topics" className="text-sm text-accent hover:underline">
          &larr; Back to topics
        </Link>
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
        </div>
      </div>

      {/* Problem list */}
      <div className="grid gap-4">
        {filtered.map((problem) => (
          <Card key={problem.id} className="hover:border-accent transition-colors">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <Link to={`/problems/${problem.id}`} className="flex-1">
                  <h3 className="font-semibold text-foreground hover:text-accent transition-colors">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {problem.description.substring(0, 100)}...
                  </p>
                </Link>
                <Badge variant="outline" className={difficultyColor[problem.difficulty]}>
                  {problem.difficulty}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">No problems found in this topic</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

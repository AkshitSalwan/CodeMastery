import { useState } from 'react';
import { Card, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';

export function TopicsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const topics = [
    { name: 'Arrays', description: 'Work with arrays and lists', problems: 142, difficulty: 'Easy' },
    { name: 'Strings', description: 'String manipulation and algorithms', problems: 98, difficulty: 'Easy' },
    { name: 'Trees', description: 'Binary trees and tree algorithms', problems: 156, difficulty: 'Medium' },
    { name: 'Graphs', description: 'Graph traversal and algorithms', problems: 87, difficulty: 'Hard' },
    { name: 'Dynamic Programming', description: 'Optimization with DP', problems: 124, difficulty: 'Hard' },
    { name: 'Sorting', description: 'Sorting algorithms and techniques', problems: 56, difficulty: 'Easy' },
    { name: 'Linked Lists', description: 'Linked list manipulation', problems: 67, difficulty: 'Medium' },
    { name: 'Hash Tables', description: 'Hash maps and sets', problems: 93, difficulty: 'Easy' },
    { name: 'Stacks & Queues', description: 'Stack and queue data structures', problems: 71, difficulty: 'Medium' },
    { name: 'Greedy', description: 'Greedy algorithms', problems: 45, difficulty: 'Medium' },
    { name: 'Math', description: 'Mathematical algorithms', problems: 62, difficulty: 'Medium' },
    { name: 'Bit Manipulation', description: 'Bit operations and tricks', problems: 38, difficulty: 'Hard' },
  ];

  const filtered = topics.filter(
    (topic) =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const difficultyColor = {
    Easy: 'bg-green-500/20 text-green-700 dark:text-green-400',
    Medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    Hard: 'bg-red-500/20 text-red-700 dark:text-red-400',
  };

  const stats = {
    total: topics.length,
    problems: topics.reduce((sum, t) => sum + t.problems, 0),
    users: 2543,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Topics</h1>
        <p className="text-muted-foreground">Explore {stats.total} topics with {stats.problems} problems</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Topics</p>
            <p className="text-3xl font-bold text-foreground mt-2">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Problems</p>
            <p className="text-3xl font-bold text-foreground mt-2">{stats.problems}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active Users</p>
            <p className="text-3xl font-bold text-foreground mt-2">{stats.users}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search topics..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground"
      />

      {/* Topics Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((topic) => (
          <Card key={topic.name} className="hover:border-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-foreground">{topic.name}</h3>
                <Badge variant="outline" className={difficultyColor[topic.difficulty]}>
                  {topic.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
              <p className="text-xs text-muted-foreground">{topic.problems} problems</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

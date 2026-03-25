import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

const difficulties = ['Easy', 'Medium', 'Hard'];
const topics = [
  'Array',
  'String',
  'Linked List',
  'Hash Table',
  'Math',
  'Tree',
  'Graph',
  'Dynamic Programming',
  'Greedy',
  'Backtracking',
];

export default function AddTopicQuestionPage({ onAddQuestion }) {
  const { bumpAdminMetric } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [topic, setTopic] = useState('Array');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }
    const newQuestion = {
      id: Date.now().toString(),
      title,
      description,
      difficulty,
      category: [topic],
      acceptanceRate: 0,
      submissions: 0,
      companies: [],
      constraints: [],
      examples: [],
      starterCode: {},
      hints: [],
      explanation: '',
      rating: 0,
      ratingCount: 0,
      createdBy: 'interviewer',
      createdAt: new Date(),
      isCustom: true,
    };
    if (onAddQuestion) onAddQuestion(newQuestion);
    bumpAdminMetric('questionsAdded', 1, { title: newQuestion.title });
    setTitle('');
    setDescription('');
    setDifficulty('Medium');
    setTopic('Array');
    setError('');
    navigate('/problems');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Add New Question by Topic</h1>
        <p className="text-muted-foreground">Submit a topic-scoped problem for the community.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Title</label>
              <input
                className="w-full mt-2 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                className="w-full mt-2 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 resize-none"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Topic</label>
                <select
                  className="w-full mt-2 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                >
                  {topics.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Difficulty</label>
                <select
                  className="w-full mt-2 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                >
                  {difficulties.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <div className="mt-4">
              <Button type="submit" className="w-full">Add Question</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

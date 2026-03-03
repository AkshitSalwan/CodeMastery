import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';

const difficulties = [
  { label: 'Easy', value: 'Easy' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Hard', value: 'Hard' },
];

const categories = [
  'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs',
  'Dynamic Programming', 'Sorting', 'Searching', 'Hashing',
  'System Design', 'Database Design', 'Web Development',
];

export default function AddQuestionPage({ onAddQuestion }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [example, setExample] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !category) {
      setError('Title, description and category are required.');
      return;
    }

    setIsSubmitting(true);
    const newQuestion = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      difficulty,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      example: example.trim(),
      createdBy: 'interviewer',
      createdAt: new Date(),
      isCustom: true,
    };
    if (onAddQuestion) onAddQuestion(newQuestion);
    setIsSubmitting(false);
    navigate('/problems');
  };

  const titleLength = title.length;
  const descriptionLength = description.length;
  const isFormValid = title.length >= 5 && description.length >= 20 && category;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Add New Question</h1>
        <p className="text-muted-foreground">Share a new problem with the community.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-foreground mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Binary Search Tree Validation"
                  maxLength={100}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  required
                />
                <div className="mt-1 text-xs text-muted-foreground">{titleLength}/100</div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter problem description..."
                  maxLength={2000}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                  required
                />
                <div className="mt-1 text-xs text-muted-foreground">{descriptionLength}/2000</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-foreground mb-2">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-2">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20"
                  >
                    {difficulties.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-2">Tags (optional)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="e.g. recursion, tree"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-2">Example (optional)</label>
                <textarea
                  value={example}
                  onChange={e => setExample(e.target.value)}
                  placeholder="Input: [1,2,3] Output: 6"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              {error && <p className="text-red-500 font-medium">{error}</p>}

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">Cancel</Button>
                <Button type="submit" className="flex-1" disabled={!isFormValid || isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Question'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}

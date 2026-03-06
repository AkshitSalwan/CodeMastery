import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  // default to first category so the submit button isn't stuck disabled
  const [category, setCategory] = useState(categories[0]);
  const [tags, setTags] = useState('');
  const [example, setExample] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const editParam = searchParams.get('edit');
    if (editParam) {
      setIsEditing(true);
      setEditId(editParam);
      // Load the question from localStorage
      const stored = localStorage.getItem('customQuestions');
      if (stored) {
        const questions = JSON.parse(stored);
        const question = questions.find(q => q.id === editParam);
        if (question) {
          setTitle(question.title || '');
          setDescription(question.description || '');
          setDifficulty(question.difficulty || 'Medium');
          setCategory(question.category || categories[0]);
          setTags((question.tags || []).join(', '));
          setExample(question.example || '');
        }
      }
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !category) {
      setError('Title, description and category are required.');
      return;
    }

    setIsSubmitting(true);
    const questionData = {
      id: isEditing ? editId : Date.now().toString(),
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

    if (isEditing) {
      // Update existing question
      const stored = localStorage.getItem('customQuestions');
      if (stored) {
        const questions = JSON.parse(stored);
        const index = questions.findIndex(q => q.id === editId);
        if (index !== -1) {
          questions[index] = questionData;
          localStorage.setItem('customQuestions', JSON.stringify(questions));
        }
      }
    } else {
      // Add new question
      if (onAddQuestion) onAddQuestion(questionData);
    }

    setIsSubmitting(false);
    navigate('/problems');
  };

  const titleLength = title.length;
  const descriptionLength = description.length;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">{isEditing ? 'Edit Question' : 'Add New Question'}</h1>
        <p className="text-muted-foreground">{isEditing ? 'Update the problem details.' : 'Share a new problem with the community.'}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Question' : 'Create Question'}</CardTitle>
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
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : isEditing ? 'Update Question' : 'Create Question'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}

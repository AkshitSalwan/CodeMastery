import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

const testTypes = [
  { label: 'Online Test', value: 'online' },
  { label: 'Offline Test', value: 'offline' },
];

const difficultyLevels = [
  { label: 'Easy', value: 'Easy' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Hard', value: 'Hard' },
  { label: 'Mixed', value: 'Mixed' },
];

const topics = [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Sorting',
  'Searching',
  'Hashing',
  'System Design',
  'Database Design',
  'Bit Manipulation',
];

export function MakeTestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    testName: '',
    description: '',
    testType: 'online',
    duration: '60',
    numQuestions: '10',
    difficulty: 'Medium',
    topics: [],
    passingScore: '70',
    instructions: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTopicChange = (topic) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.testName.trim()) {
      setError('Test name is required.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Test description is required.');
      return;
    }
    if (formData.topics.length === 0) {
      setError('Please select at least one topic.');
      return;
    }
    if (parseInt(formData.numQuestions) <= 0) {
      setError('Number of questions must be greater than 0.');
      return;
    }
    if (parseInt(formData.duration) <= 0) {
      setError('Duration must be greater than 0 minutes.');
      return;
    }

    setIsSubmitting(true);

    // Create test object
    const newTest = {
      id: Date.now().toString(),
      testName: formData.testName.trim(),
      description: formData.description.trim(),
      testType: formData.testType,
      duration: parseInt(formData.duration),
      numQuestions: parseInt(formData.numQuestions),
      difficulty: formData.difficulty,
      topics: formData.topics,
      passingScore: parseInt(formData.passingScore),
      instructions: formData.instructions.trim(),
      createdBy: user?.name || 'Unknown Interviewer',
      createdAt: new Date().toISOString(),
      status: 'draft',
      totalCandidates: 0,
    };

    // Save to localStorage
    const existingTests = JSON.parse(localStorage.getItem('createdTests') || '[]');
    existingTests.push(newTest);
    localStorage.setItem('createdTests', JSON.stringify(existingTests));

    setIsSubmitting(false);
    
    // Show confirmation and redirect
    alert(`Test "${formData.testName}" created successfully!`);
    navigate('/contests');
  };

  const isFormValid = 
    formData.testName.trim().length > 0 &&
    formData.description.trim().length > 0 &&
    formData.topics.length > 0;

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Make a Test</h1>
        <p className="text-muted-foreground">
          Create a coding test for candidates. Configure topics, difficulty, and test settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Test Name */}
            <div>
              <label className="block font-medium text-foreground mb-2">Test Name *</label>
              <input
                type="text"
                name="testName"
                value={formData.testName}
                onChange={handleInputChange}
                placeholder="e.g. DSA Level 1 Assessment"
                maxLength={100}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                required
              />
              <div className="mt-1 text-xs text-muted-foreground">
                {formData.testName.length}/100
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium text-foreground mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the purpose and structure of this test..."
                maxLength={500}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                required
              />
              <div className="mt-1 text-xs text-muted-foreground">
                {formData.description.length}/500
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Test Type */}
              <div>
                <label className="block font-medium text-foreground mb-2">Test Type</label>
                <select
                  name="testType"
                  value={formData.testType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                >
                  {testTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block font-medium text-foreground mb-2">Difficulty Level</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                >
                  {difficultyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block font-medium text-foreground mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                  max="360"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block font-medium text-foreground mb-2">Number of Questions</label>
                <input
                  type="number"
                  name="numQuestions"
                  value={formData.numQuestions}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>

              {/* Passing Score */}
              <div>
                <label className="block font-medium text-foreground mb-2">Passing Score (%)</label>
                <input
                  type="number"
                  name="passingScore"
                  value={formData.passingScore}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>
            </div>

            {/* Topics Selection */}
            <div>
              <label className="block font-medium text-foreground mb-3">Topics *</label>
              <p className="text-sm text-muted-foreground mb-3">Select at least one topic</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {topics.map(topic => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleTopicChange(topic)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.topics.includes(topic)
                        ? 'bg-primary text-primary-foreground border border-primary'
                        : 'bg-secondary/30 text-foreground border border-border hover:bg-secondary/50'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Selected: {formData.topics.length} topic(s)
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block font-medium text-foreground mb-2">Test Instructions (Optional)</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                placeholder="Add any specific instructions for candidates taking this test..."
                maxLength={1000}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
              />
              <div className="mt-1 text-xs text-muted-foreground">
                {formData.instructions.length}/1000
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-6 border-t border-border">
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Creating Test...' : 'Create Test'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/contests')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Box */}
      <Card className="bg-secondary/30 border-secondary/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-3">Next Steps</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>Your test will be saved as a draft</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>You can edit or publish it from the Contests page</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>Share the test link with candidates for them to take the test</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">4.</span>
              <span>View candidate submissions and results in real-time</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default MakeTestPage;

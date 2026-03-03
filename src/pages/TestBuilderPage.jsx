import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

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

const difficultyLevels = [
  { label: 'Easy', value: 'Easy' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Hard', value: 'Hard' },
];

export function TestBuilderPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('setup'); // 'setup' or 'questions'
  const [error, setError] = useState('');

  // Test Setup State
  const [testSetup, setTestSetup] = useState({
    testName: '',
    description: '',
    duration: '60',
    passingScore: '70',
    testDifficulty: 'Medium',
    selectedTopics: [],
    testType: 'online',
  });

  // Questions State
  const [questions, setQuestions] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // ==================== Step 1: Test Setup ====================
  const handleSetupChange = (field, value) => {
    setTestSetup(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTopicToggle = (topic) => {
    setTestSetup(prev => ({
      ...prev,
      selectedTopics: prev.selectedTopics.includes(topic)
        ? prev.selectedTopics.filter(t => t !== topic)
        : [...prev.selectedTopics, topic],
    }));
  };

  const handleProceedToQuestions = () => {
    setError('');
    
    if (!testSetup.testName.trim()) {
      setError('Test name is required.');
      return;
    }
    if (!testSetup.description.trim()) {
      setError('Test description is required.');
      return;
    }
    if (testSetup.selectedTopics.length === 0) {
      setError('Please select at least one topic.');
      return;
    }

    setCurrentStep('questions');
    setError('');
  };

  // ==================== Step 2: Question Management ====================
  const handleDeleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const calculateTotalScore = () => {
    return questions.reduce((sum, q) => sum + q.score, 0);
  };

  const handleCompleteTest = () => {
    if (questions.length === 0) {
      setError('Please add at least one question to the test.');
      return;
    }

    const testData = {
      id: Date.now().toString(),
      ...testSetup,
      questions: questions,
      totalScore: calculateTotalScore(),
      totalQuestions: questions.length,
      createdBy: user?.name || 'Unknown Interviewer',
      createdAt: new Date().toISOString(),
      status: 'draft',
    };

    // Save to localStorage
    const existingTests = JSON.parse(localStorage.getItem('testBuilderTests') || '[]');
    existingTests.push(testData);
    localStorage.setItem('testBuilderTests', JSON.stringify(existingTests));

    alert(`Test "${testSetup.testName}" created successfully with ${questions.length} questions!`);
    navigate('/contests');
  };

  const totalScore = calculateTotalScore();

  // ==================== STEP 1: TEST SETUP ====================
  if (currentStep === 'setup') {
    return (
      <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Test Builder - Step 1: Setup</h1>
          <p className="text-muted-foreground">
            Configure your test details and select topics for the questions.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              
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
                  value={testSetup.testName}
                  onChange={(e) => handleSetupChange('testName', e.target.value)}
                  placeholder="e.g. DSA Level 1 Assessment"
                  maxLength={100}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
                <div className="mt-1 text-xs text-muted-foreground">
                  {testSetup.testName.length}/100
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-foreground mb-2">Description *</label>
                <textarea
                  value={testSetup.description}
                  onChange={(e) => handleSetupChange('description', e.target.value)}
                  placeholder="Describe the test objectives and structure..."
                  maxLength={500}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                />
                <div className="mt-1 text-xs text-muted-foreground">
                  {testSetup.description.length}/500
                </div>
              </div>

              {/* Grid Layout */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Test Type */}
                <div>
                  <label className="block font-medium text-foreground mb-2">Test Type</label>
                  <select
                    value={testSetup.testType}
                    onChange={(e) => handleSetupChange('testType', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  >
                    <option value="online">Online Test</option>
                    <option value="offline">Offline Test</option>
                  </select>
                </div>

                {/* Test Difficulty */}
                <div>
                  <label className="block font-medium text-foreground mb-2">Test Difficulty Level</label>
                  <select
                    value={testSetup.testDifficulty}
                    onChange={(e) => handleSetupChange('testDifficulty', e.target.value)}
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
                    value={testSetup.duration}
                    onChange={(e) => handleSetupChange('duration', e.target.value)}
                    min="1"
                    max="360"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                </div>

                {/* Passing Score */}
                <div>
                  <label className="block font-medium text-foreground mb-2">Passing Score (%)</label>
                  <input
                    type="number"
                    value={testSetup.passingScore}
                    onChange={(e) => handleSetupChange('passingScore', e.target.value)}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                </div>
              </div>

              {/* Topics Selection */}
              <div>
                <label className="block font-medium text-foreground mb-3">Select Topics *</label>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose at least one topic for your test questions
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {topics.map(topic => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleTopicToggle(topic)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        testSetup.selectedTopics.includes(topic)
                          ? 'bg-primary text-primary-foreground border border-primary'
                          : 'bg-secondary/30 text-foreground border border-border hover:bg-secondary/50'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Selected: {testSetup.selectedTopics.length} topic(s)
                </div>
              </div>

              {/* Proceed Button */}
              <div className="flex gap-3 pt-6 border-t border-border">
                <Button
                  onClick={handleProceedToQuestions}
                  className="flex-1"
                >
                  Next: Add Questions
                </Button>
                <Button
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
      </div>
    );
  }

  // ==================== STEP 2: ADD QUESTIONS ====================
  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Test Builder - Step 2: Add Questions</h1>
        <p className="text-muted-foreground">
          Add questions to your test and configure their difficulty level and scores.
        </p>
      </div>

      {/* Test Summary Card */}
      <Card className="bg-secondary/30 border-secondary/50">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Test Name</p>
              <p className="text-lg font-bold text-foreground">{testSetup.testName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Topics</p>
              <p className="text-lg font-bold text-primary">{testSetup.selectedTopics.length}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Difficulty</p>
              <p className="text-lg font-bold text-accent">{testSetup.testDifficulty}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Duration</p>
              <p className="text-lg font-bold text-foreground">{testSetup.duration} min</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Add Questions Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Add Questions to Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Click the button below to navigate to the question creation page where you can add detailed questions with descriptions, code examples, and test cases.
            </p>
            <button
              onClick={() => navigate('/add-question')}
              className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2 text-lg"
            >
              <Plus className="h-5 w-5" />
              Create New Question
            </button>
            <p className="text-xs text-muted-foreground text-center pt-2">
              You'll be redirected to the question creation page where you can add comprehensive questions.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Questions ({questions.length})
          </h2>
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
              Total Score: {totalScore} points
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary/50 text-foreground">
              {testSetup.selectedTopics.length} Topics
            </span>
          </div>
        </div>

        {questions.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No questions added yet. Add your first question above!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {questions.map((question, index) => (
              <Card key={question.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/30 transition"
                >
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{question.title}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-medium">
                          {question.topic}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                          question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                          'bg-red-500/20 text-red-600 dark:text-red-400'
                        }`}>
                          {question.difficulty}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-bold">
                          {question.score} pts
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {expandedQuestion === question.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedQuestion === question.id && (
                  <div className="border-t border-border px-6 py-4 bg-secondary/20 space-y-4">
                    {question.description && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Description</p>
                        <p className="text-sm text-foreground">{question.description}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Topic</p>
                        <p className="text-sm font-medium text-foreground">{question.topic}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Difficulty</p>
                        <p className="text-sm font-medium text-foreground">{question.difficulty}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Score</p>
                        <p className="text-sm font-bold text-primary">{question.score} points</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition text-sm font-medium"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Question
                    </button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t border-border">
        <Button
          onClick={() => setCurrentStep('setup')}
          variant="outline"
          className="flex-1"
        >
          Back to Setup
        </Button>
        <Button
          onClick={handleCompleteTest}
          disabled={questions.length === 0}
          className="flex-1"
        >
          Complete Test ({questions.length} Questions, {totalScore} Points)
        </Button>
      </div>
    </div>
  );
}

export default TestBuilderPage;

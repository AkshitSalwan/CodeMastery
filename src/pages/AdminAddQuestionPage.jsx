import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { AlertCircle, Loader2, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const difficulties = ['Easy', 'Medium', 'Hard'];
const languages = ['javascript', 'python', 'java', 'cpp'];
const categories = [
  'Array', 'String', 'Linked List', 'Tree', 'Graph',
  'Dynamic Programming', 'Sorting', 'Searching', 'Hash Table',
  'Math', 'Stack', 'Queue', 'Heap', 'Binary Search',
  'Greedy', 'Backtracking'
];

export default function AdminAddQuestionPage({
  pageTitle = 'Create New Question',
  pageDescription = 'Add new problems with AI-generated test cases and hints',
  redirectTo = '/admin',
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    difficulty: 'Medium',
    tags: [],
    topic_id: null,
    constraints: [],
    examples: [],
    starter_code: {},
    time_limit: 2000,
    memory_limit: 256,
    points: 100,
    hints: [],
    solution: ''
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [generatingTests, setGeneratingTests] = useState(false);
  const [generatingHints, setGeneratingHints] = useState(false);
  const [generatingStarterCode, setGeneratingStarterCode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [hiddenTestCases, setHiddenTestCases] = useState([]);
  const [newVisibleTestCase, setNewVisibleTestCase] = useState({ input: '', output: '', explanation: '' });
  const [newHiddenTestCase, setNewHiddenTestCase] = useState({ input: '', output: '' });
  const [activeTab, setActiveTab] = useState('basic');
  const [newTag, setNewTag] = useState('');
  const [newConstraint, setNewConstraint] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [starterCodeOpen, setStarterCodeOpen] = useState({});

  // Check admin access
  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'interviewer') {
      navigate('/problems');
    }
  }, [user, navigate]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addConstraint = () => {
    if (newConstraint.trim() && !formData.constraints.includes(newConstraint.trim())) {
      setFormData(prev => ({
        ...prev,
        constraints: [...prev.constraints, newConstraint.trim()]
      }));
      setNewConstraint('');
    }
  };

  const removeConstraint = (constraint) => {
    setFormData(prev => ({
      ...prev,
      constraints: prev.constraints.filter(c => c !== constraint)
    }));
  };

  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [...prev.examples, { input: '', output: '', explanation: '' }]
    }));
  };

  const updateExample = (index, field, value) => {
    setFormData(prev => {
      const newExamples = [...prev.examples];
      newExamples[index][field] = value;
      return { ...prev, examples: newExamples };
    });
  };

  const removeExample = (index) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const updateStarterCode = (language, code) => {
    setFormData(prev => ({
      ...prev,
      starter_code: { ...prev.starter_code, [language]: code }
    }));
  };

  const addVisibleTestCase = () => {
    if (!newVisibleTestCase.input.trim() || !newVisibleTestCase.output.trim()) {
      setError('Test case input and output are required');
      return;
    }
    
    setTestCases(prev => [...prev, newVisibleTestCase]);
    setNewVisibleTestCase({ input: '', output: '', explanation: '' });
    setSuccess('Visible test case added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const removeVisibleTestCase = (index) => {
    setTestCases(prev => prev.filter((_, i) => i !== index));
  };

  const addHiddenTestCase = () => {
    if (!newHiddenTestCase.input.trim() || !newHiddenTestCase.output.trim()) {
      setError('Hidden test case input and output are required');
      return;
    }
    
    setHiddenTestCases(prev => [...prev, newHiddenTestCase]);
    setNewHiddenTestCase({ input: '', output: '' });
    setSuccess('Hidden test case added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const removeHiddenTestCase = (index) => {
    setHiddenTestCases(prev => prev.filter((_, i) => i !== index));
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  const generateAITestCases = async () => {
    if (!formData.title || !formData.description) {
      setError('Please fill in title and description first');
      return;
    }

    setGeneratingTests(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/problems/generate-test-cases', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          constraints: formData.constraints,
          examples: formData.examples,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || data?.message || 'Failed to generate test cases');
      }

      const visibleCases = data.test_cases || data.visible_test_cases || [];
      const hiddenCases = data.hidden_test_cases || [];

      setTestCases(visibleCases);
      setHiddenTestCases(hiddenCases);
      setSuccess(data.message || `Generated ${visibleCases.length} visible and ${hiddenCases.length} hidden test cases!`);
    } catch (err) {
      setError(`Error generating test cases: ${err.message}`);
    } finally {
      setGeneratingTests(false);
    }
  };

  const generateAIHints = async () => {
    if (!formData.title || !formData.description) {
      setError('Please fill in title and description first');
      return;
    }

    setGeneratingHints(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/problems/generate-hints', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || data?.message || 'Failed to generate hints');
      }

      const hints = data.hints || [];
      setFormData(prev => ({ ...prev, hints }));
      setSuccess(data.message || `Generated ${hints.length} hints!`);
    } catch (err) {
      setError(`Error generating hints: ${err.message}`);
    } finally {
      setGeneratingHints(false);
    }
  };

  const generateAIStarterCode = async () => {
    if (!formData.title || !formData.description) {
      setError('Please fill in title and description first');
      return;
    }

    setGeneratingStarterCode(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/problems/generate-starter-code', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          constraints: formData.constraints,
          examples: formData.examples,
          test_cases: testCases,
          languages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || data?.message || 'Failed to generate starter code');
      }

      const starterCode = data.starter_code || {};
      setFormData(prev => ({
        ...prev,
        starter_code: {
          ...prev.starter_code,
          ...starterCode,
        },
      }));

      const count = Object.keys(starterCode).length;
      setSuccess(data.message || `Generated starter code for ${count} language(s)!`);
    } catch (err) {
      setError(`Error generating starter code: ${err.message}`);
    } finally {
      setGeneratingStarterCode(false);
    }
  };

  const submitQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('📝 Starting question submission...');

    try {
      // Validation checks
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (formData.title.length < 5) {
        throw new Error('Title must be at least 5 characters');
      }
      if (formData.title.length < 10) {
        throw new Error('Title should be more descriptive (at least 10 characters)');
      }

      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (formData.description.length < 20) {
        throw new Error('Description must be at least 20 characters');
      }
      if (formData.description.length < 50) {
        throw new Error('Description is too brief. Please provide detailed problem statement (at least 50 characters)');
      }

      // Require examples
      if (formData.examples.length === 0) {
        throw new Error('At least one example is required');
      }
      if (formData.examples.length < 2) {
        throw new Error('Please provide at least 2 examples to help users understand the problem');
      }

      // Validate examples have all fields
      for (let i = 0; i < formData.examples.length; i++) {
        const ex = formData.examples[i];
        if (!ex.input?.trim()) {
          throw new Error(`Example ${i + 1}: Input is required`);
        }
        if (!ex.output?.trim()) {
          throw new Error(`Example ${i + 1}: Output is required`);
        }
      }

      if (testCases.length === 0) {
        throw new Error('Please generate or add test cases');
      }

      // Require constraints for non-trivial problems
      if (formData.difficulty === 'Medium' || formData.difficulty === 'Hard') {
        if (formData.constraints.length === 0) {
          throw new Error(`${formData.difficulty} problems should have constraints specified`);
        }
      }

      // Validate starter code - compulsory requirement
      const starterCodeLanguages = Object.keys(formData.starter_code).filter(lang => formData.starter_code[lang]?.trim());
      if (starterCodeLanguages.length === 0) {
        throw new Error('Starter code is required! Please add boilerplate code for at least one language.');
      }

      console.log('✓ Form validation passed');

      // Generate slug if not provided
      const slug = formData.slug || formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      
      // Validate slug
      if (slug.length < 5) {
        throw new Error('Slug must be at least 5 characters. Title needs more words.');
      }

      // Create problem object for API
      const problemPayload = {
        title: formData.title,
        slug: slug,
        description: formData.description,
        difficulty: formData.difficulty.toLowerCase(),  // Convert to lowercase for validation
        tags: formData.tags,
        topic_id: formData.topic_id,
        constraints: formData.constraints,
        examples: formData.examples,
        test_cases: testCases,
        hidden_test_cases: hiddenTestCases,
        hints: formData.hints,
        starter_code: formData.starter_code,
        time_limit: formData.time_limit,
        memory_limit: formData.memory_limit,
        points: formData.points,
        solution: formData.solution
      };

      console.log('📤 Sending problem to backend...');
      // Send to backend API
      const createRes = await fetch('/api/problems', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(problemPayload)
      });

      console.log('Create response status:', createRes.status);

      if (!createRes.ok) {
        const errText = await createRes.text();
        console.error('Create error response:', errText);
        throw new Error(`Failed to create problem (${createRes.status}): ${errText || 'Unknown error'}`);
      }

      const result = await createRes.json();
      console.log('✅ Problem created successfully!', result);
      setSuccess(`Question created successfully! ✨ Problem ID: ${result.problem.id}`);
      
      // Reset form
      setTimeout(() => {
        setFormData({
          title: '',
          slug: '',
          description: '',
          difficulty: 'Medium',
          tags: [],
          topic_id: null,
          constraints: [],
          examples: [],
          starter_code: {},
          time_limit: 2000,
          memory_limit: 256,
          points: 100,
          hints: [],
          solution: ''
        });
        setTestCases([]);
        setHiddenTestCases([]);
        setActiveTab('basic');
        navigate(redirectTo);
      }, 2000);
    } catch (err) {
      console.error('❌ Error:', err.message);
      console.error('Full error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-amber-500" />
            {pageTitle}
          </h1>
          <p className="text-muted-foreground mt-2">
            {pageDescription}
          </p>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-900">Success</h3>
            <p className="text-sm text-green-800">{success}</p>
          </div>
        </div>
      )}

      <form onSubmit={submitQuestion} className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          {['basic', 'details', 'examples', 'tests', 'code'].map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* BASIC TAB */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Two Sum, Binary Tree Level Order Traversal"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Slug (Auto-generated)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter problem description..."
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Difficulty
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    >
                      {difficulties.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Points
                    </label>
                    <input
                      type="number"
                      name="points"
                      value={formData.points}
                      onChange={handleInputChange}
                      min="1"
                      max="1000"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* DETAILS TAB */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Problem Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tags/Categories
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Enter tag and press Add"
                      className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add Tag
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:bg-red-500 hover:text-white rounded px-1"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Constraints */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Constraints
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newConstraint}
                      onChange={(e) => setNewConstraint(e.target.value)}
                      placeholder="e.g., 1 <= n <= 10^5"
                      className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addConstraint())}
                    />
                    <Button type="button" onClick={addConstraint} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {formData.constraints.map((constraint, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm text-foreground">{constraint}</span>
                        <button
                          type="button"
                          onClick={() => removeConstraint(constraint)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time & Memory Limits */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Time Limit (ms)
                    </label>
                    <input
                      type="number"
                      name="time_limit"
                      value={formData.time_limit}
                      onChange={handleInputChange}
                      min="100"
                      step="100"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Memory Limit (MB)
                    </label>
                    <input
                      type="number"
                      name="memory_limit"
                      value={formData.memory_limit}
                      onChange={handleInputChange}
                      min="32"
                      step="32"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* EXAMPLES TAB */}
        {activeTab === 'examples' && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Examples
                  <Badge variant={formData.examples.length >= 2 ? 'secondary' : 'destructive'}>
                    {formData.examples.length} / 2+
                  </Badge>
                </CardTitle>
                <Button type="button" onClick={addExample} variant="outline" size="sm">
                  Add Example
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.examples.length === 0 ? (
                  <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    At least 2 examples are required. Add examples to show users how to solve this problem.
                  </p>
                ) : (
                  <>
                    {formData.examples.map((example, idx) => {
                      const isComplete = example.input?.trim() && example.output?.trim();
                      return (
                        <div key={idx} className={`p-4 border rounded-lg space-y-3 ${
                          isComplete
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}>
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground">Example {idx + 1}</h4>
                              {isComplete ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExample(idx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Input"
                            value={example.input}
                            onChange={(e) => updateExample(idx, 'input', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                          />
                          <input
                            type="text"
                            placeholder="Output"
                            value={example.output}
                            onChange={(e) => updateExample(idx, 'output', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                          />
                          <textarea
                            placeholder="Explanation (optional but recommended)"
                            value={example.explanation}
                            onChange={(e) => updateExample(idx, 'explanation', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                          />
                        </div>
                      );
                    })}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* TESTS TAB */}
        {activeTab === 'tests' && (
          <div className="space-y-6">
            {/* AI Generation Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  AI-Generated Test Cases
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    onClick={generateAITestCases}
                    disabled={generatingTests || !formData.title || !formData.description}
                    className="flex items-center gap-2"
                  >
                    {generatingTests && <Loader2 className="w-4 h-4 animate-spin" />}
                    {generatingTests ? 'Generating...' : 'Generate Test Cases with AI'}
                  </Button>
                  <Button
                    type="button"
                    onClick={generateAIHints}
                    disabled={generatingHints || !formData.title || !formData.description}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {generatingHints && <Loader2 className="w-4 h-4 animate-spin" />}
                    Generate Hints
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Visible Test Cases Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Visible Test Cases
                  <Badge variant={testCases.length > 0 ? 'secondary' : 'destructive'}>
                    {testCases.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Manual Add Form */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                  <h4 className="font-medium text-foreground">Add Visible Test Case Manually</h4>
                  <input
                    type="text"
                    placeholder="Input (e.g., '2 3' or 'hello world')"
                    value={newVisibleTestCase.input}
                    onChange={(e) => setNewVisibleTestCase(prev => ({ ...prev, input: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                  <input
                    type="text"
                    placeholder="Output (e.g., '5' or 'HELLO WORLD')"
                    value={newVisibleTestCase.output}
                    onChange={(e) => setNewVisibleTestCase(prev => ({ ...prev, output: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                  <textarea
                    placeholder="Explanation (optional)"
                    value={newVisibleTestCase.explanation}
                    onChange={(e) => setNewVisibleTestCase(prev => ({ ...prev, explanation: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                  />
                  <Button
                    type="button"
                    onClick={addVisibleTestCase}
                    variant="outline"
                    className="w-full"
                  >
                    Add Visible Test Case
                  </Button>
                </div>

                {/* Display Test Cases */}
                {testCases.length === 0 ? (
                  <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    No visible test cases yet. Generate them with AI or add manually.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {testCases.map((tc, idx) => (
                      <div key={idx} className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold bg-green-200 text-green-900 px-2 py-1 rounded">
                              Test Case {idx + 1}
                            </span>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeVisibleTestCase(idx)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-1 text-sm font-mono">
                          <div><span className="text-muted-foreground">Input:</span> {tc.input}</div>
                          <div><span className="text-muted-foreground">Output:</span> {tc.output}</div>
                          {tc.explanation && <div><span className="text-muted-foreground">Explanation:</span> {tc.explanation}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hidden Test Cases Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Hidden Test Cases
                  <Badge variant="outline">
                    {hiddenTestCases.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Manual Add Form */}
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-3">
                  <h4 className="font-medium text-foreground">Add Hidden Test Case Manually</h4>
                  <input
                    type="text"
                    placeholder="Input"
                    value={newHiddenTestCase.input}
                    onChange={(e) => setNewHiddenTestCase(prev => ({ ...prev, input: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                  <input
                    type="text"
                    placeholder="Output"
                    value={newHiddenTestCase.output}
                    onChange={(e) => setNewHiddenTestCase(prev => ({ ...prev, output: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                  <Button
                    type="button"
                    onClick={addHiddenTestCase}
                    variant="outline"
                    className="w-full"
                  >
                    Add Hidden Test Case
                  </Button>
                </div>

                {/* Display Hidden Test Cases */}
                {hiddenTestCases.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hidden test cases yet.</p>
                ) : (
                  <div className="space-y-2">
                    {hiddenTestCases.map((tc, idx) => (
                      <div key={idx} className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex justify-between items-start">
                        <div className="space-y-1 text-sm font-mono flex-1">
                          <div><span className="text-muted-foreground">Input:</span> {tc.input}</div>
                          <div><span className="text-muted-foreground">Output:</span> {tc.output}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeHiddenTestCase(idx)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hints Card */}
            {formData.hints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Hints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {formData.hints.map((hint, idx) => (
                      <div key={idx} className="p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                        {idx + 1}. {hint}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* CODE TAB */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Starter Code & Solution</span>
                  <Badge className="bg-red-500 text-white">Required</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status of Starter Code */}
                <div className={`p-4 rounded-lg border-2 ${
                  Object.keys(formData.starter_code).some(lang => formData.starter_code[lang]?.trim())
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {Object.keys(formData.starter_code).some(lang => formData.starter_code[lang]?.trim()) ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <h4 className={`font-medium ${
                      Object.keys(formData.starter_code).some(lang => formData.starter_code[lang]?.trim())
                        ? 'text-green-900'
                        : 'text-red-900'
                    }`}>
                      Starter Code Status
                    </h4>
                  </div>
                  <p className={`text-sm ${
                    Object.keys(formData.starter_code).some(lang => formData.starter_code[lang]?.trim())
                      ? 'text-green-800'
                      : 'text-red-800'
                  }`}>
                    {Object.keys(formData.starter_code).some(lang => formData.starter_code[lang]?.trim())
                      ? `✓ Boilerplate code provided for: ${Object.keys(formData.starter_code)
                          .filter(lang => formData.starter_code[lang]?.trim())
                          .map(lang => lang.charAt(0).toUpperCase() + lang.slice(1))
                          .join(', ')}`
                      : '⚠ Boilerplate code is REQUIRED. You must add starter code for at least one language.'}
                  </p>
                </div>

                {/* Starter Code */}
                <div>
                  <h3 className="font-medium text-foreground mb-3">Starter Code <span className="text-red-500">*</span></h3>
                  <div className="mb-3">
                    <Button
                      type="button"
                      onClick={generateAIStarterCode}
                      disabled={generatingStarterCode || !formData.title || !formData.description}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {generatingStarterCode && <Loader2 className="w-4 h-4 animate-spin" />}
                      <Sparkles className="w-4 h-4" />
                      Generate Starter Code with AI
                    </Button>
                  </div>
                  <div className="flex gap-2 mb-3">
                    {languages.map(lang => (
                      <Button
                        key={lang}
                        type="button"
                        onClick={() => setSelectedLanguage(lang)}
                        variant={selectedLanguage === lang ? 'default' : 'outline'}
                        size="sm"
                        className={formData.starter_code[lang]?.trim() ? 'border-green-500 border-2' : ''}
                      >
                        <span>{lang.charAt(0).toUpperCase() + lang.slice(1)}</span>
                        {formData.starter_code[lang]?.trim() && (
                          <CheckCircle2 className="w-3 h-3 ml-1 text-green-600" />
                        )}
                      </Button>
                    ))}
                  </div>
                  <textarea
                    value={formData.starter_code[selectedLanguage] || ''}
                    onChange={(e) => updateStarterCode(selectedLanguage, e.target.value)}
                    placeholder={`Enter ${selectedLanguage} boilerplate code (required)...`}
                    rows={8}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground font-mono placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                  />
                </div>

                {/* Solution */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Solution Code
                  </label>
                  <textarea
                    name="solution"
                    value={formData.solution}
                    onChange={handleInputChange}
                    placeholder="Enter the solution code..."
                    rows={8}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground font-mono placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Submit Button */}
        <div className="space-y-3">
          {/* Quality Check Section */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-blue-900">
                <AlertCircle className="w-4 h-4" />
                Problem Quality Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className={`flex items-center gap-2 p-2 rounded ${
                  formData.title && formData.title.length >= 10
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {formData.title && formData.title.length >= 10 ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>Descriptive Title (10+ chars)</span>
                </div>

                <div className={`flex items-center gap-2 p-2 rounded ${
                  formData.description && formData.description.length >= 50
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {formData.description && formData.description.length >= 50 ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>Detailed Description (50+ chars)</span>
                </div>

                <div className={`flex items-center gap-2 p-2 rounded ${
                  formData.examples.length >= 2
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {formData.examples.length >= 2 ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>Examples ({formData.examples.length} of 2+)</span>
                </div>

                <div className={`flex items-center gap-2 p-2 rounded ${
                  testCases.length > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {testCases.length > 0 ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>Test Cases ({testCases.length} generated)</span>
                </div>

                <div className={`flex items-center gap-2 p-2 rounded ${
                  (formData.difficulty === 'Easy' || formData.constraints.length > 0)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {(formData.difficulty === 'Easy' || formData.constraints.length > 0) ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>Constraints {formData.difficulty !== 'Easy' && '(required)'}</span>
                </div>

                <div className={`flex items-center gap-2 p-2 rounded ${
                  Object.keys(formData.starter_code).some(lang => formData.starter_code[lang]?.trim())
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {Object.keys(formData.starter_code).some(lang => formData.starter_code[lang]?.trim()) ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>Boilerplate Code (required)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Validation Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              formData.title && formData.title.length >= 10
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {formData.title && formData.title.length >= 10 ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm font-medium">Title</span>
            </div>

            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              formData.description && formData.description.length >= 50
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {formData.description && formData.description.length >= 50 ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm font-medium">Description</span>
            </div>

            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              formData.examples.length >= 2
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {formData.examples.length >= 2 ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm font-medium">Examples</span>
            </div>

            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              testCases.length > 0
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {testCases.length > 0 ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm font-medium">Test Cases</span>
            </div>

            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              (formData.difficulty === 'Easy' || formData.constraints.length > 0)
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {(formData.difficulty === 'Easy' || formData.constraints.length > 0) ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm font-medium">Constraints</span>
            </div>

            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              Object.keys(formData.starter_code).some(lang => formData.starter_code[lang]?.trim())
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {Object.keys(formData.starter_code).some(lang => formData.starter_code[lang]?.trim()) ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm font-medium">Boilerplate</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.title ||
                formData.title.length < 10 ||
                !formData.description ||
                formData.description.length < 50 ||
                formData.examples.length < 2 ||
                testCases.length === 0 ||
                (formData.difficulty !== 'Easy' && formData.constraints.length === 0) ||
                !Object.keys(formData.starter_code).some(lang => formData.starter_code[lang]?.trim())
              }
              className="flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Question
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(redirectTo)}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

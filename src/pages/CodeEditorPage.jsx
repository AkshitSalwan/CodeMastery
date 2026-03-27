import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { problems } from '../data/problems';
import { Play, Copy, RefreshCw, Save, CheckCircle, XCircle, Clock, Zap, AlertCircle } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { DiscussionPanel } from '../components/DiscussionPanel';
import { mockTestCases } from '../../lib/mock-data/test-cases';
import { useAuth } from '../context/AuthContext';
import { compareExecutionOutput } from '../utils/problemExecution';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth-token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('No auth token found in localStorage. User may not be authenticated.');
  }
  return headers;
};

export function CodeEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if user is authenticated
  const isAuthenticated = user || localStorage.getItem('auth-token');
  
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { markProblemSolved } = useAuth();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [customExpectedOutput, setCustomExpectedOutput] = useState('');
  const [customRunResult, setCustomRunResult] = useState(null);
  const [runnerMode, setRunnerMode] = useState('sample'); // 'sample' or 'custom'
  const editorRef = useRef(null);

  const normalizeProblemData = (rawProblem) => {
    if (!rawProblem) {
      return rawProblem;
    }

    const normalizedProblem = { ...rawProblem };

    const toArray = (value) => {
      if (Array.isArray(value)) {
        return value;
      }

      if (value == null || value === '') {
        return [];
      }

      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (error) {
          return value
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }

      return [];
    };

    normalizedProblem.constraints = toArray(normalizedProblem.constraints);
    normalizedProblem.hints = toArray(normalizedProblem.hints);
    normalizedProblem.examples = toArray(normalizedProblem.examples);
    normalizedProblem.test_cases = toArray(normalizedProblem.test_cases);
    normalizedProblem.tags = Array.isArray(normalizedProblem.tags) ? normalizedProblem.tags : [];

    if (!normalizedProblem.difficulty && normalizedProblem.difficulty !== '') {
      normalizedProblem.difficulty = 'Unknown';
    }

    return normalizedProblem;
  };

  // Fetch problem from API or static data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        // First try API
        const response = await fetch(`/api/problems/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProblem(normalizeProblemData(data.problem || data));
        } else {
          // Fall back to static problems
          const staticProblem = problems.find(p => String(p.id) === String(id));
          setProblem(normalizeProblemData(staticProblem));
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
        // Fall back to static problems
        const staticProblem = problems.find(p => String(p.id) === String(id));
        setProblem(normalizeProblemData(staticProblem));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id]);

  const normalizeOutput = (str) => (str || '').replace(/\s+/g, '').replace(/\r/g, '').trim();

  useEffect(() => {
    if (problem && language) {
      // Handle both API format (starter_code as string/JSON) and static format (starterCode as object)
      let starterCode = '';
      
      if (problem.starterCode && typeof problem.starterCode === 'object') {
        // Static format: object with language keys
        starterCode = problem.starterCode[language] || '';
      } else if (problem.starter_code) {
        // API format: string or JSON string
        try {
          const parsed = typeof problem.starter_code === 'string' 
            ? JSON.parse(problem.starter_code) 
            : problem.starter_code;
          
          if (typeof parsed === 'object' && parsed[language]) {
            starterCode = parsed[language];
          } else if (typeof parsed === 'string') {
            starterCode = parsed;
          }
        } catch (e) {
          starterCode = problem.starter_code || '';
        }
      }
      
      setCode(starterCode);
    }
  }, [problem, language]);

  useEffect(() => {
    // Clear results when switching between modes to keep UI consistent
    if (runnerMode === 'custom') {
      setTestResults([]);
    } else {
      setCustomRunResult(null);
    }
  }, [runnerMode]);

  // Use built-in mock test cases for core problems when explicit testCases are not defined
  // Handle both API format (test_cases) and static format (testCases)
  const effectiveTestCases = problem?.testCases?.length
    ? problem.testCases
    : (problem?.test_cases?.length ? problem.test_cases : (mockTestCases[problem?.id] || []));

  // Normalize test cases to consistent format with expectedOutput field
  const normalizedTestCases = effectiveTestCases.map(tc => ({
    input: tc.input || '',
    expectedOutput: tc.expectedOutput || tc.output || '',
    expected: tc.expected || tc.expectedOutput || tc.output || ''
  }));

  // Only show a small set of sample test cases (no hidden tests)
  const displayedTestCases = normalizedTestCases.slice(0, 2);

  const monacoLanguageMap = {
    javascript: 'javascript',
    python: 'python',
    java: 'java',
    cpp: 'cpp',
  };

  const themes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'vs-light', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast' },
  ];
  const [theme, setTheme] = useState('vs-dark');

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertCircle className="h-5 w-5" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-yellow-800">
              You need to be logged in to run and submit code. Please log in to your account to continue.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/sign-in')}
                className="flex-1"
              >
                Log In
              </Button>
              <Button 
                onClick={() => navigate('/problems')}
                variant="outline"
                className="flex-1"
              >
                View Problems
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading problem...</div>;
  }

  if (!problem) {
    return <div className="text-center py-12 text-destructive">Problem not found</div>;
  }

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // Handle both API format and static format
    let starterCode = '';
    if (problem.starterCode && typeof problem.starterCode === 'object') {
      starterCode = problem.starterCode[newLanguage] || '';
    } else if (problem.starter_code) {
      try {
        const parsed = typeof problem.starter_code === 'string' 
          ? JSON.parse(problem.starter_code) 
          : problem.starter_code;
        if (typeof parsed === 'object' && parsed[newLanguage]) {
          starterCode = parsed[newLanguage];
        } else if (typeof parsed === 'string') {
          starterCode = parsed;
        }
      } catch (e) {
        starterCode = problem.starter_code || '';
      }
    }
    setCode(starterCode);
  };

  const handleRun = async () => {
    const trimmedCode = code.trim();

    // No code written
    if (!trimmedCode) {
      setOutput('Error: No code to run. Please write something in the editor.');
      return;
    }

    setIsRunning(true);
    setOutput('Running code on Judge0...');

    try {
      const API_BASE = import.meta.env.VITE_API_BASE || '';
      const activeTestCaseInput =
        runnerMode === 'custom'
          ? customInput
          : (displayedTestCases[0]?.input || '');

      const response = await fetch(`${API_BASE}/api/problems/run`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          language,
          code: trimmedCode,
          stdin: activeTestCaseInput,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        let errorMessage = `Error from backend (${response.status}):\n${errText}`;
        
        if (response.status === 401) {
          const token = localStorage.getItem('auth-token');
          errorMessage = token 
            ? `Authentication failed. Your session may have expired. Please log in again.\n\nError: ${errText}`
            : `Authentication required. Please log in to run code.\n\nError: ${errText}`;
          console.error('Auth error details:', { 
            hasToken: !!token,
            response: response.status,
            error: errText 
          });
        }
        
        setOutput(errorMessage);
        setIsRunning(false);
        return;
      }

      const result = await response.json();

      const status = result.status?.description || 'Unknown';
      const time = result.time != null ? `${result.time}s` : 'N/A';
      const memory = result.memory != null ? `${result.memory} KB` : 'N/A';

      // Compilation error
      if (result.compile_output) {
        setOutput(
          `Compilation Error (${status})\n\n${result.compile_output}`
        );
      } else if (result.stderr) {
        // Runtime error
        setOutput(
          `Runtime Error (${status})\n\n${result.stderr}`
        );
      } else {
        // Successful run (or other statuses with stdout)
        const header = status === 'Accepted' ? '✓ Accepted' : `Status: ${status}`;
        setOutput(
          `${header}\n\nTime: ${time}\nMemory: ${memory}\n\nOutput:\n${result.stdout || ''}`
        );
      }
    } catch (err) {
      console.error(err);
      setOutput('Unexpected error while talking to Judge0.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunCustom = async () => {
    if (!code.trim()) {
      setOutput('Error: No code to run. Please write something in the editor.');
      return;
    }

    setIsRunning(true);
    setCustomRunResult(null);
    setOutput('Running custom input on Judge0...');

    try {
      const API_BASE = import.meta.env.VITE_API_BASE || '';
      const response = await fetch(`${API_BASE}/api/problems/run`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          language,
          code: code.trim(),
          stdin: customInput,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        let errorMessage = `Error from backend (${response.status}):\n${errText}`;
        
        if (response.status === 401) {
          const token = localStorage.getItem('auth-token');
          errorMessage = token 
            ? `Authentication failed. Your session may have expired. Please log in again.\n\nError: ${errText}`
            : `Authentication required. Please log in to run code.\n\nError: ${errText}`;
          console.error('Auth error details:', { 
            hasToken: !!token,
            response: response.status,
            error: errText 
          });
        }
        
        setOutput(errorMessage);
        setIsRunning(false);
        return;
      }

      const result = await response.json();
      const status = result.status?.description || 'Unknown';
      const time = result.time != null ? `${result.time}s` : 'N/A';
      const memory = result.memory != null ? `${result.memory} KB` : 'N/A';

      let actual = '';
      if (result.compile_output) {
        actual = result.compile_output;
      } else if (result.stderr) {
        actual = result.stderr;
      } else {
        actual = (result.stdout ?? '').toString();
      }

      const normalizedExpected = normalizeOutput(customExpectedOutput);
      const normalizedActual = normalizeOutput(actual);
      const passed = normalizedExpected ? normalizedActual === normalizedExpected : null;

      setCustomRunResult({
        passed,
        actual: actual.trim(),
        expected: customExpectedOutput.trim(),
        status,
        time,
        memory,
      });

      const header = status === 'Accepted' ? '✓ Accepted' : `Status: ${status}`;
      setOutput(`${header}\n\nTime: ${time}\nMemory: ${memory}\n\nOutput:\n${actual}`);
    } catch (err) {
      console.error(err);
      setOutput('Unexpected error while talking to Judge0.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunTestCases = async () => {
    if (!code.trim()) {
      setOutput('Error: No code to run. Please write something in the editor.');
      return [];
    }

    if (displayedTestCases.length === 0) {
      setOutput('Error: No test cases available for this problem.');
      return [];
    }

    setIsRunning(true);
    setTestResults([]);

    try {
      const API_BASE = import.meta.env.VITE_API_BASE || '';
      
      // Send all test cases to backend for proper comparison
      const testCasesForBackend = displayedTestCases.map((tc, idx) => ({
        input: tc.input,
        expected: (tc.expectedOutput ?? tc.expected ?? '').toString(),
        testNum: idx + 1,
      }));

      console.log('Sending test cases to backend:', testCasesForBackend);
      console.log('Test cases details:', displayedTestCases);

      const response = await fetch(`${API_BASE}/api/problems/run`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          language,
          code: code.trim(),
          testCases: testCasesForBackend,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Backend response:', result);
        
        // Map backend results to frontend format
        // Backend returns either 'results' or 'testResults'
        const backendResults = result.results || result.testResults || [];
        
        const results = backendResults.map((backendResult, idx) => {
          // Get expected output from original test case
          const originalTestCase = displayedTestCases[idx] || {};
          const expected = (originalTestCase.expectedOutput ?? originalTestCase.expected ?? '').toString();
          
          return {
            testNum: idx + 1,
            input: backendResult.input,
            expected: expected,
            output: (backendResult.actualOutput || backendResult.actual || '').trim(),
            passed: backendResult.passed === true,
            status: result.status,
            time: backendResult.runtime,
            memory: backendResult.memory,
            error: backendResult.error,
          };
        });

        console.log('Mapped results:', results);
        setTestResults(results);
        return results;
      } else {
        const errorText = await response.text();
        let errorMessage = `Error: Failed to run tests - ${errorText}`;
        
        if (response.status === 401) {
          const token = localStorage.getItem('auth-token');
          errorMessage = token 
            ? `Authentication failed. Your session may have expired. Please log in again.\n\nError: ${errorText}`
            : `Authentication required. Please log in to run tests.\n\nError: ${errorText}`;
          console.error('Auth error details:', { 
            hasToken: !!token,
            response: response.status,
            error: errorText 
          });
        }
        
        console.error('Backend error:', errorText);
        setOutput(errorMessage);
        return [];
      }
    } catch (err) {
      console.error('Network error:', err);
      setOutput('Error: Network error while running tests - ' + err.message);
      return [];
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setOutput('Error: No code to submit. Please write something in the editor.');
      return;
    }

    setIsSubmitted(true);
    setSubmissionStatus('running');
    setIsRunning(true);
    setOutput('Submitting solution...');

    try {
      const API_BASE = import.meta.env.VITE_API_BASE || '';
      const response = await fetch(`${API_BASE}/api/problems/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          problem_id: problem?.id,
          code: code.trim(),
          language,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        let errorMessage = `Error from backend (${response.status}):\n${errText}`;

        if (response.status === 401) {
          const token = localStorage.getItem('auth-token');
          errorMessage = token
            ? `Authentication failed. Your session may have expired. Please log in again.\n\nError: ${errText}`
            : `Authentication required. Please log in to submit code.\n\nError: ${errText}`;
        }

        setSubmissionStatus('failed');
        setOutput(errorMessage);
        return;
      }

      const result = await response.json();
      const submission = result.submission || {};
      const verdict = submission.verdict || 'wrong_answer';
      const visibleResults = (submission.test_results || []).map((testResult, index) => ({
        testNum: index + 1,
        input: testResult.input,
        expected: testResult.expectedOutput,
        output: (testResult.actualOutput || '').trim(),
        passed: testResult.passed === true,
        time: testResult.runtime,
        memory: testResult.memory,
        error: testResult.error,
      }));

      setTestResults(visibleResults);

      const accepted = verdict === 'accepted';
      setSubmissionStatus(accepted ? 'accepted' : 'failed');

      if (accepted) {
        setOutput(`Accepted\n\nPassed ${submission.passed_tests}/${submission.total_tests} test cases`);
        if (problem) {
          markProblemSolved(problem);
        }
      } else {
        const details = visibleResults.length > 0
          ? visibleResults
              .map((testResult) => {
                const status = testResult.passed ? 'PASS' : 'FAIL';
                return `Test ${testResult.testNum}: ${status}\nInput: ${testResult.input}\nExpected: ${testResult.expected}\nGot: ${testResult.output || testResult.error || ''}`;
              })
              .join('\n\n')
          : 'No visible test case details returned.';

        setOutput(
          `${String(verdict).replace(/_/g, ' ')}\n\nPassed ${submission.passed_tests}/${submission.total_tests} test cases\n\n${details}`
        );
      }

      try {
        await fetch(`${API_BASE}/api/dpp/update`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
      } catch (progressError) {
        console.warn('Failed to refresh DPP progress after submission:', progressError);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('failed');
      setOutput('Unexpected error while submitting code.');
    } finally {
      setIsRunning(false);
    }

    return;

    setIsSubmitted(true);
    setSubmissionStatus('running');
    setOutput('Running tests...');

    // Run all test cases and determine result based on fresh results
    const results = await handleRunTestCases();
    
    if (!results || results.length === 0) {
      setOutput('Error: No test results returned. Please check your code.');
      setSubmissionStatus('failed');
      return;
    }
    
    const allPassed = results.every(result => result.passed === true);
    const passedCount = results.filter(r => r.passed === true).length;
    
    // Set submission status
    setSubmissionStatus(allPassed ? 'accepted' : 'failed');
    
    // Create detailed output message with test details
    if (allPassed) {
      setOutput(`✓ Accepted\n\nAll ${results.length} test case${results.length > 1 ? 's' : ''} passed!\n\n${results.map((r, i) => `Test ${i + 1}: ✓ PASS`).join('\n')}`);
      if (problem) {
        markProblemSolved(problem);
      }
    } else {
      const details = results.map((r, i) => `Test ${i + 1}: ${r.passed ? '✓ PASS' : '✗ FAIL'}\nInput: ${r.input}\nExpected: ${r.expected}\nGot: ${r.output}`).join('\n\n');
      setOutput(`✗ Wrong Answer\n\nPassed ${passedCount}/${results.length} test cases\n\n${details}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      'Resetting will discard any changes you made. Do you want to continue?'
    );
    if (!confirmed) return;

    // Handle both API format (starter_code as string) and static format (starterCode as object)
    let starterCode = '';
    
    if (problem.starterCode && typeof problem.starterCode === 'object') {
      // Static format: object with language keys
      starterCode = problem.starterCode[language] || '';
    } else if (problem.starter_code) {
      // API format: JSON string
      try {
        const parsed = typeof problem.starter_code === 'string' 
          ? JSON.parse(problem.starter_code) 
          : problem.starter_code;
        if (typeof parsed === 'object' && parsed[language]) {
          starterCode = parsed[language];
        } else if (typeof parsed === 'string') {
          starterCode = parsed;
        }
      } catch (e) {
        starterCode = problem.starter_code || '';
      }
    }

    setCode(starterCode);
    setOutput('');
    setTestResults([]);
    setIsSubmitted(false);
    setSubmissionStatus(null);
    setCustomInput('');
    setCustomExpectedOutput('');
    setCustomRunResult(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <PanelGroup direction="horizontal">
        {/* Problem Description */}
        <Panel defaultSize={35} minSize={25}>
          <div className="h-full overflow-y-auto space-y-4 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{problem.title}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                    {problem.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {problem.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">{problem.description}</p>
                </div>

                {problem.constraints.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Constraints</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {problem.constraints.map((constraint, idx) => (
                        <li key={idx} className="text-muted-foreground text-sm">
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {problem.examples.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Examples</h3>
                    {problem.examples.map((example, idx) => (
                      <div key={idx} className="bg-secondary/50 p-3 rounded-lg text-sm mb-3">
                        <p className="font-mono text-foreground">Input: {example.input}</p>
                        <p className="font-mono text-foreground mt-1">Output: {example.output}</p>
                        {example.explanation && (
                          <p className="text-muted-foreground mt-2">Explanation: {example.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {problem.hints.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Hints</h3>
                    {problem.hints.map((hint, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground p-2 bg-secondary/30 rounded mb-2">
                        {idx + 1}. {hint}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Panel>

        <PanelResizeHandle className="w-2 bg-border hover:bg-accent transition-colors" />

        {/* Code Editor and Output */}
        <Panel defaultSize={65} minSize={40}>
          <PanelGroup direction="vertical">
            {/* Code Editor */}
            <Panel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col gap-4 p-4">
                {/* Editor Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <select
                      value={language}
                      onChange={handleLanguageChange}
                      className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                    >
                      {themes.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleReset}>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleRun} disabled={isRunning}>
                      <Play className="h-4 w-4 mr-1" />
                      {isRunning ? 'Running...' : 'Run'}
                    </Button>
                    <Button size="sm" onClick={handleSubmit} disabled={isRunning}>
                      <Save className="h-4 w-4 mr-1" />
                      Submit
                    </Button>
                  </div>
                </div>
                <Card className="flex-1 flex flex-col overflow-hidden">
                  <Editor
                    height="100%"
                    language={monacoLanguageMap[language]}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme={theme}
                    options={{
                      minimap: { enabled: true },
                      fontSize: 14,
                      fontFamily: 'Fira Code, monospace',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      wordWrap: 'on',
                      tabSize: 2,
                      insertSpaces: true,
                    }}
                  />
                </Card>
              </div>
            </Panel>

            <PanelResizeHandle className="h-2 bg-border hover:bg-accent transition-colors" />

            {/* Output and Test Results */}
            <Panel defaultSize={25} minSize={20}>
              <div className="h-full flex flex-col gap-4 p-4">
                {/* Submission Status */}
                {isSubmitted && submissionStatus && (
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        {submissionStatus === 'accepted' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : submissionStatus === 'failed' ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                        <span className={`font-semibold ${submissionStatus === 'accepted' ? 'text-green-600' :
                            submissionStatus === 'failed' ? 'text-red-600' :
                              'text-yellow-600'
                          }`}>
                          {submissionStatus === 'accepted' ? 'Accepted' :
                            submissionStatus === 'failed' ? 'Failed' :
                              'Running...'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Mode toggle */}
                <div className="flex items-center gap-2">
                  <button
                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${runnerMode === 'sample' ? 'bg-primary text-primary-foreground' : 'bg-secondary/30 text-foreground'}`}
                    onClick={() => setRunnerMode('sample')}
                    type="button"
                  >
                    Sample Tests
                  </button>
                  <button
                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${runnerMode === 'custom' ? 'bg-primary text-primary-foreground' : 'bg-secondary/30 text-foreground'}`}
                    onClick={() => setRunnerMode('custom')}
                    type="button"
                  >
                    Custom Input
                  </button>
                </div>

                {/* Custom Input */}
                {runnerMode === 'custom' && (
                  <Card>
                    <CardHeader className="py-3 border-b border-border">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Custom Input
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-3 space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">
                          Input (stdin)
                        </label>
                        <textarea
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          placeholder="Enter custom stdin input"
                          className="w-full h-24 p-2 rounded-lg border border-border bg-background text-foreground text-sm font-mono resize-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">
                          Expected Output (optional)
                        </label>
                        <textarea
                          value={customExpectedOutput}
                          onChange={(e) => setCustomExpectedOutput(e.target.value)}
                          placeholder="Enter expected output (for pass/fail feedback)"
                          className="w-full h-20 p-2 rounded-lg border border-border bg-background text-foreground text-sm font-mono resize-none"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Button size="sm" variant="outline" onClick={handleRunCustom} disabled={isRunning}>
                          <Play className="h-4 w-4 mr-1" />
                          {isRunning ? 'Running...' : 'Run Custom'}
                        </Button>
                        {customRunResult && customRunResult.passed != null && (
                          <span className={`text-sm font-semibold ${customRunResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {customRunResult.passed ? 'Passed' : 'Failed'}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Test Results */}
                {runnerMode === 'sample' && testResults.length > 0 && (
                  <Card>
                    <CardHeader className="py-3 border-b border-border">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Test Results ({testResults.filter(r => r.passed).length}/{testResults.length})
                        </CardTitle>
                        <Button size="sm" variant="outline" onClick={handleRunTestCases} disabled={isRunning}>
                          <Play className="h-4 w-4 mr-1" />
                          {isRunning ? 'Running...' : 'Run Tests'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="max-h-32 overflow-y-auto py-3">
                      <div className="space-y-2">
                        {testResults.map((result, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            {result.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span>Test {idx + 1}:</span>
                            <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                              {result.passed ? 'Passed' : 'Failed'}
                            </span>
                            {result.time && <span className="text-muted-foreground">({result.time}s)</span>}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Output */}
                <Card className="flex-1 flex flex-col">
                  <CardHeader className="py-3 border-b border-border">
                    <CardTitle className="text-sm">Console Output</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto py-3">
                    {output ? (
                      <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">
                        {output}
                      </pre>
                    ) : (
                      <p className="text-xs text-muted-foreground">Run your code (Run / Run Tests / Run Custom) to see output</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </Panel>

            <PanelResizeHandle className="h-2 bg-border hover:bg-accent transition-colors" />

            {/* Discussions */}
            {/* <Panel defaultSize={25} minSize={15}>
              <div className="h-full p-4 overflow-y-auto">
                <DiscussionPanel problemId={id} />
              </div>
            </Panel> */}
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}

import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { problems } from '../data/problems';
import { Play, Copy, RefreshCw, Save, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { DiscussionPanel } from '../components/DiscussionPanel';
import { mockTestCases } from '../../lib/mock-data/test-cases';

export function CodeEditorPage() {
  const { id } = useParams();
  const problem = problems.find(p => p.id === id);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(problem?.starterCode[language] || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const editorRef = useRef(null);

  // Use built-in mock test cases for core problems when explicit testCases are not defined
  const effectiveTestCases = problem.testCases && problem.testCases.length
    ? problem.testCases
    : (mockTestCases[problem.id] || []);

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

  if (!problem) {
    return <div className="text-center py-12">Problem not found</div>;
  }

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(problem.starterCode[newLanguage] || '');
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

      const response = await fetch(`${API_BASE}/api/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code: trimmedCode,
          stdin: '',
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        setOutput(`Error from backend (${response.status}):\n${errText}`);
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

  const handleRunTestCases = async () => {
    if (!effectiveTestCases.length) return [];

    setIsRunning(true);
    setTestResults([]);

    const results = [];
    for (const testCase of effectiveTestCases) {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || '';
        const response = await fetch(`${API_BASE}/api/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language,
            code,
            stdin: testCase.input,
          }),
        });

          if (response.ok) {
            const result = await response.json();
            const expected = (testCase.expectedOutput ?? testCase.expected ?? '').toString().trim();
            const actual = (result.stdout ?? '').toString().trim();
            const passed = actual === expected;
          results.push({
            ...testCase,
            passed,
              output: result.stdout || '',
            status: result.status?.description || 'Unknown',
            time: result.time,
            memory: result.memory,
          });
        } else {
          results.push({
            ...testCase,
            passed: false,
            output: 'Error',
            status: 'Error',
          });
        }
      } catch (err) {
        results.push({
          ...testCase,
          passed: false,
          output: 'Network Error',
          status: 'Error',
        });
      }
    }

    setTestResults(results);
    setIsRunning(false);

    return results;
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    setSubmissionStatus('running');

    // Run all test cases and determine result based on fresh results
    const results = await handleRunTestCases();
    const allPassed = (results || []).every(result => result.passed);
    setSubmissionStatus(allPassed ? 'accepted' : 'failed');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const handleReset = () => {
    setCode(problem.starterCode[language] || '');
    setOutput('');
    setTestResults([]);
    setIsSubmitted(false);
    setSubmissionStatus(null);
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
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
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
                    <Button size="sm" variant="outline" onClick={handleRunTestCases} disabled={isRunning}>
                      <Play className="h-4 w-4 mr-1" />
                      {isRunning ? 'Running...' : 'Run Tests'}
                    </Button>
                    <Button size="sm" onClick={handleSubmit} disabled={isRunning || isSubmitted}>
                      <Save className="h-4 w-4 mr-1" />
                      {isSubmitted ? 'Submitted' : 'Submit'}
                    </Button>
                  </div>
                </div>

                {/* Code Editor */}
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
                        <span className={`font-semibold ${
                          submissionStatus === 'accepted' ? 'text-green-600' :
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

                {/* Test Results */}
                {testResults.length > 0 && (
                  <Card>
                    <CardHeader className="py-3 border-b border-border">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Test Results ({testResults.filter(r => r.passed).length}/{testResults.length})
                      </CardTitle>
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
                      <p className="text-xs text-muted-foreground">Click "Run Tests" to see output</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </Panel>

            <PanelResizeHandle className="h-2 bg-border hover:bg-accent transition-colors" />

            {/* Discussions */}
            <Panel defaultSize={25} minSize={15}>
              <div className="h-full p-4 overflow-y-auto">
                <DiscussionPanel problemId={id} />
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}

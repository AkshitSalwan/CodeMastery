import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { problems } from '../data/problems';
import { Play, Copy, RefreshCw } from 'lucide-react';

export function CodeEditorPage() {
  const { id } = useParams();
  const problem = problems.find(p => p.id === id);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(problem?.starterCode[language] || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);

  if (!problem) {
    return <div className="text-center py-12">Problem not found</div>;
  }

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(problem.starterCode[newLanguage] || '');
  };

  const handleRun = async () => {
    if (!code.trim()) {
      setOutput('Error: No code to run. Please write something in the editor.');
      return;
    }

    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput(`✓ Compiled Successfully\n\nTest Results:\nPassed: 3/3\nRuntime: 45ms\nMemory: 24.5MB\n\nOutput:\n42`);
      setIsRunning(false);
    }, 1500);
  };

  const handleReset = () => {
    setCode(problem.starterCode[language]);
    setOutput('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
      {/* Problem Description */}
      <div className="overflow-y-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{problem.title}</CardTitle>
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

      {/* Code Editor */}
      <div className="flex flex-col gap-4 overflow-hidden">
        {/* Editor Header */}
        <div className="flex items-center justify-between gap-2">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="px-3 py-2 rounded-lg border border-border bg-background text-foreground"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button size="sm" onClick={handleRun} disabled={isRunning}>
              <Play className="h-4 w-4 mr-1" />
              {isRunning ? 'Running...' : 'Run'}
            </Button>
          </div>
        </div>

        {/* Code Editor */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 bg-background text-foreground font-mono text-sm border-0 outline-none resize-none"
            spellCheck="false"
          />
        </Card>

        {/* Output */}
        <Card className="max-h-48 flex flex-col">
          <CardHeader className="py-3 border-b border-border">
            <CardTitle className="text-sm">Output</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto py-3">
            {output ? (
              <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-words">
                {output}
              </pre>
            ) : (
              <p className="text-xs text-muted-foreground">Click "Run" to see output</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

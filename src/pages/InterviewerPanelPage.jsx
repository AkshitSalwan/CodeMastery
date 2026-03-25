import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useAuth } from '../context/AuthContext';

const fallbackCandidates = [
  { name: 'Aarav Sharma', email: 'aarav@testmail.dev', score: 86, status: 'Qualified' },
  { name: 'Priya Verma', email: 'priya@testmail.dev', score: 79, status: 'Review' },
  { name: 'Rohan Mehta', email: 'rohan@testmail.dev', score: 72, status: 'Shortlist' },
];

export function InterviewerPanelPage() {
  const { user } = useAuth();

  const tests = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('testBuilderTests') || '[]');
    } catch {
      return [];
    }
  }, []);

  const customQuestions = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('customQuestions') || '[]');
    } catch {
      return [];
    }
  }, []);

  const recentTests = tests.slice().reverse().slice(0, 5);
  const latestContest = recentTests[0] || null;
  const leaderboard = fallbackCandidates.slice().sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Interviewer Panel</h1>
          <p className="mt-2 text-muted-foreground">
            Manage contests, candidate lists, leaderboards, and contest-ready question setup.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/make-test">
            <Button variant="outline">Build Test</Button>
          </Link>
          <Link to="/questions/add">
            <Button variant="outline">Add Question</Button>
          </Link>
          <Link to="/contests/new">
            <Button>Create Contest</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Contests Setup', value: tests.length, tone: 'text-cyan-500' },
          { label: 'Question Bank', value: customQuestions.length, tone: 'text-emerald-500' },
          { label: 'Candidates', value: fallbackCandidates.length, tone: 'text-amber-500' },
          {
            label: 'Avg Testcases / Contest',
            value: tests.length
              ? Math.round(
                  tests.reduce((sum, test) => sum + (test.questions?.length || 0), 0) / tests.length
                )
              : 0,
            tone: 'text-rose-500',
          },
        ].map((item) => (
          <Card key={item.label} className="rounded-2xl">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className={`mt-2 text-3xl font-bold ${item.tone}`}>{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Contest Workspace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTests.length > 0 ? recentTests.map((test) => (
              <div key={test.id} className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{test.testName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{test.description}</p>
                  </div>
                  <Badge variant="outline">{test.testDifficulty}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">{test.questions?.length || 0} questions</Badge>
                  <Badge variant="secondary">{test.duration} min</Badge>
                  <Badge variant="secondary">{test.passingScore}% passing</Badge>
                  <Badge variant="secondary">{test.selectedTopics?.length || 0} topics</Badge>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No contests created yet. Start from the test builder.</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Contest Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {latestContest ? `Leaderboard for ${latestContest.testName}` : 'Sample candidate leaderboard'}
            </p>
            {leaderboard.map((candidate, index) => (
              <div key={candidate.email} className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-4">
                <div>
                  <p className="font-medium text-foreground">{index + 1}. {candidate.name}</p>
                  <p className="text-sm text-muted-foreground">{candidate.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">{candidate.score}</p>
                  <Badge variant="outline">{candidate.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Candidate List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {fallbackCandidates.map((candidate) => (
              <div key={candidate.email} className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                  </div>
                  <Badge variant="outline">{candidate.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Contest Question Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Interviewers control the contest-side details here: question count, testcase count, time limits, and difficulty mix.
            </p>
            {(latestContest?.questions || []).length > 0 ? latestContest.questions.map((question) => (
              <div key={question.id} className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{question.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{question.description}</p>
                  </div>
                  <Badge variant="outline">{question.difficulty}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">{Array.isArray(question.category) ? question.category.join(', ') : question.category}</Badge>
                  <Badge variant="secondary">{question.timeLimit || '2s'} time limit</Badge>
                  <Badge variant="secondary">{question.memoryLimit || '256MB'} memory</Badge>
                  <Badge variant="secondary">{question.testCases?.length || 0} testcases</Badge>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">
                Create a contest from the test builder to see question, testcase count, and timing data here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

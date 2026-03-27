import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import apiService from '../services/apiService';
import { buildSeedDraftTests } from '../data/sampleDraftTests';

const statusTone = (status) => {
  if (status === 'participating') return 'secondary';
  if (status === 'registered') return 'outline';
  if (status === 'finished') return 'default';
  return 'outline';
};

const normalizeTextKey = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ');

export function InterviewerPanelPage() {
  const [contests, setContests] = useState([]);
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [draftTests, setDraftTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishingDraftId, setPublishingDraftId] = useState(null);
  const [expandedDraftId, setExpandedDraftId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedContest = useMemo(
    () => contests.find((contest) => contest.id === selectedContestId) || null,
    [contests, selectedContestId]
  );

  const loadContests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.contests.getMine();
      const nextContests = response?.contests || [];
      setContests(nextContests);
      setSelectedContestId((prev) => {
        if (!prev && nextContests.length > 0) {
          return nextContests[0].id;
        }
        if (prev && !nextContests.find((contest) => contest.id === prev)) {
          return nextContests[0]?.id || null;
        }
        return prev;
      });
    } catch (loadError) {
      setError(loadError.message || 'Failed to load interviewer contests');
      setContests([]);
    } finally {
      setLoading(false);
    }
  };

  const markDraftPublished = (draftId, contestId) => {
    try {
      const stored = JSON.parse(localStorage.getItem('testBuilderTests') || '[]');
      if (!Array.isArray(stored)) return;

      const updated = stored.map((test) =>
        String(test.id) === String(draftId)
          ? {
              ...test,
              status: 'published',
              published_contest_id: contestId,
              published_at: new Date().toISOString(),
            }
          : test
      );

      localStorage.setItem('testBuilderTests', JSON.stringify(updated));
      setDraftTests(updated.slice().reverse());
    } catch {
      // ignore localStorage update errors for publish metadata
    }
  };

  const loadPublishedProblems = async () => {
    const allProblems = [];
    const limit = 200;
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages && page <= 20) {
      const response = await apiService.fetchWithAuth(`/problems?page=${page}&limit=${limit}`);
      const pageProblems = Array.isArray(response?.problems) ? response.problems : [];
      allProblems.push(...pageProblems);
      totalPages = Number(response?.pagination?.totalPages || 1);
      page += 1;
    }

    return allProblems;
  };

  const resolveDraftProblemIds = (draftQuestions, publishedProblems) => {
    const byId = new Map();
    const bySlug = new Map();
    const byTitle = new Map();

    for (const problem of publishedProblems) {
      const numericId = Number(problem.id);
      if (Number.isInteger(numericId) && numericId > 0) {
        byId.set(numericId, numericId);
      }

      const slugKey = normalizeTextKey(problem.slug);
      if (slugKey) {
        bySlug.set(slugKey, numericId);
      }

      const titleKey = normalizeTextKey(problem.title);
      if (titleKey) {
        byTitle.set(titleKey, numericId);
      }
    }

    const resolvedIds = [];
    const unresolved = [];

    for (const question of draftQuestions || []) {
      const directId = Number(question?.id);
      const questionSlug = normalizeTextKey(question?.slug);
      const questionTitle = normalizeTextKey(question?.title);

      let matchedId = null;
      if (Number.isInteger(directId) && byId.has(directId)) {
        matchedId = byId.get(directId);
      } else if (questionSlug && bySlug.has(questionSlug)) {
        matchedId = bySlug.get(questionSlug);
      } else if (questionTitle && byTitle.has(questionTitle)) {
        matchedId = byTitle.get(questionTitle);
      }

      if (matchedId) {
        resolvedIds.push(matchedId);
      } else {
        unresolved.push(question?.title || `ID ${question?.id || 'unknown'}`);
      }
    }

    return {
      validProblemIds: [...new Set(resolvedIds)],
      unresolvedQuestions: unresolved,
    };
  };

  const publishDraftToContest = async (draft) => {
    setError('');
    setSuccess('');
    setPublishingDraftId(draft.id);

    try {
      const minutes = Math.max(15, parseInt(draft.duration || 60, 10) || 60);
      const start = new Date();
      const end = new Date(start.getTime() + minutes * 60 * 1000);

      const publishedProblems = await loadPublishedProblems();
      const {
        validProblemIds: uniqueProblemIds,
        unresolvedQuestions,
      } = resolveDraftProblemIds(draft.questions || [], publishedProblems);

      if (uniqueProblemIds.length === 0) {
        throw new Error('No DB-backed problems found in this draft. Add questions created via /questions/add and try again.');
      }

      const payload = {
        title: draft.testName || draft.title || 'Untitled Test Contest',
        slug: `${(draft.testName || draft.title || 'test-contest').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
        description: draft.description || 'Published from Test Builder',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        problems: uniqueProblemIds,
        rules: draft.description || 'Solve as many problems as possible within the test duration.',
        penalty: 10,
        max_participants: 1000,
        visibility: 'public',
        contest_type: 'hiring',
        scoring: {
          mode: 'testcase_weighted',
          source: 'test_builder',
        },
      };

      const created = await apiService.contests.create(payload);
      const contestId = created?.contest?.id;

      if (contestId) {
        markDraftPublished(draft.id, contestId);
      }

      await loadContests();
      if (contestId) {
        setSelectedContestId(contestId);
      }

      if (unresolvedQuestions.length > 0) {
        setSuccess(
          `Published "${draft.testName || draft.title || 'Draft'}" as live contest${contestId ? ` #${contestId}` : ''}. ` +
          `Skipped ${unresolvedQuestions.length} non-DB question(s): ${unresolvedQuestions.slice(0, 3).join(', ')}${unresolvedQuestions.length > 3 ? '...' : ''}`
        );
      } else {
        setSuccess(`Published "${draft.testName || draft.title || 'Draft'}" as live contest${contestId ? ` #${contestId}` : ''}.`);
      }
    } catch (publishError) {
      setError(publishError.message || 'Failed to publish draft test as contest');
    } finally {
      setPublishingDraftId(null);
    }
  };

  const seedDraftTestsIfNeeded = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem('testBuilderTests') || '[]');
      const existingDrafts = Array.isArray(stored) ? stored : [];

      const publishedProblems = await loadPublishedProblems();
      const seededDrafts = buildSeedDraftTests(publishedProblems);

      if (seededDrafts.length > 0) {
        const existingIds = new Set(existingDrafts.map((draft) => String(draft.id)));
        const mergedDrafts = [
          ...existingDrafts,
          ...seededDrafts.filter((draft) => !existingIds.has(String(draft.id))),
        ];

        localStorage.setItem('testBuilderTests', JSON.stringify(mergedDrafts));
        setDraftTests(mergedDrafts.slice().reverse());
        return;
      }

      setDraftTests(existingDrafts.slice().reverse());
    } catch {
      setDraftTests([]);
    }
  };

  useEffect(() => {
    loadContests();
    const interval = setInterval(loadContests, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    seedDraftTestsIfNeeded();
  }, []);

  useEffect(() => {
    const loadContestLiveData = async () => {
      if (!selectedContestId) {
        setParticipants([]);
        setLeaderboard([]);
        return;
      }

      try {
        const [participantsData, leaderboardData] = await Promise.all([
          apiService.contests.participants(selectedContestId),
          apiService.contests.leaderboard(selectedContestId),
        ]);

        setParticipants(participantsData?.participants || []);
        setLeaderboard(leaderboardData?.leaderboard || []);
      } catch (liveError) {
        setError(liveError.message || 'Failed to load participants and leaderboard');
        setParticipants([]);
        setLeaderboard([]);
      }
    };

    loadContestLiveData();
  }, [selectedContestId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Interviewer Panel</h1>
          <p className="mt-2 text-muted-foreground">
            Monitor contest commencement, learner attendance, and testcase-based leaderboard scores.
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

      {error ? (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900/40">
          <CardContent className="p-4 text-sm text-red-700 dark:text-red-300">{error}</CardContent>
        </Card>
      ) : null}

      {success ? (
        <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-900/40">
          <CardContent className="p-4 text-sm text-emerald-700 dark:text-emerald-300">{success}</CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Contests Created</p>
            <p className="mt-2 text-3xl font-bold text-cyan-500">{contests.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Learners Joined</p>
            <p className="mt-2 text-3xl font-bold text-emerald-500">{participants.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Active Learners</p>
            <p className="mt-2 text-3xl font-bold text-amber-500">
              {participants.filter((participant) => participant.status === 'participating').length}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Submissions Ranked</p>
            <p className="mt-2 text-3xl font-bold text-rose-500">{leaderboard.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Contest Workspace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading contests...</p>
          ) : contests.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {contests.map((contest) => (
                <button
                  key={contest.id}
                  type="button"
                  onClick={() => setSelectedContestId(contest.id)}
                  className={`rounded-2xl border p-4 text-left transition ${selectedContestId === contest.id ? 'border-accent bg-accent/10' : 'border-border/70 bg-background/60'}`}
                >
                  <p className="text-lg font-semibold text-foreground">{contest.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{contest.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="secondary">{contest.status}</Badge>
                    <Badge variant="secondary">{(contest.problems || []).length} problems</Badge>
                    <Badge variant="secondary">{contest.participants_count || 0} joined</Badge>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No contests created yet.</p>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Draft Tests (From Test Builder)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {draftTests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No draft tests yet. Use Build Test to create one.
            </p>
          ) : draftTests.slice(0, 8).map((test) => (
            <div key={test.id} className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{test.testName || test.title || 'Untitled Test'}</p>
                  <p className="text-sm text-muted-foreground">{test.description || 'No description'}</p>
                </div>
                <Badge variant={test.published_contest_id ? 'default' : 'secondary'}>
                  {test.published_contest_id ? 'published' : 'draft'}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline">{test.totalQuestions || test.questions?.length || 0} questions</Badge>
                <Badge variant="outline">{test.duration || 0} min</Badge>
                <Badge variant="outline">{test.testDifficulty || 'Medium'}</Badge>
                {test.published_contest_id ? <Badge variant="outline">Contest #{test.published_contest_id}</Badge> : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedDraftId((prev) => (prev === test.id ? null : test.id))}
                >
                  {expandedDraftId === test.id ? 'Hide Questions' : 'Preview Questions'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => publishDraftToContest(test)}
                  disabled={publishingDraftId === test.id || !!test.published_contest_id}
                >
                  {publishingDraftId === test.id ? 'Publishing...' : test.published_contest_id ? 'Already Published' : 'Publish As Contest'}
                </Button>
                {test.published_contest_id ? (
                  <Link to="/contests">
                    <Button type="button" variant="outline" size="sm">Open Contests</Button>
                  </Link>
                ) : null}
              </div>
              {expandedDraftId === test.id ? (
                <div className="mt-4 space-y-2">
                  {(test.questions || []).length === 0 ? (
                    <p className="text-xs text-muted-foreground">No questions found in this draft.</p>
                  ) : (
                    (test.questions || []).map((question, idx) => (
                      <div key={`${test.id}-${question.id}-${idx}`} className="rounded-lg border border-border/60 bg-background p-3">
                        <p className="text-sm font-medium text-foreground">
                          {idx + 1}. {question.title || 'Untitled Question'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Problem ID: {question.id} • {question.difficulty || 'Medium'} • {question.score || 0} pts
                        </p>
                      </div>
                    ))
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Learners Attending</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedContest ? (
              <p className="text-sm text-muted-foreground">Contest: {selectedContest.title}</p>
            ) : null}
            {participants.length === 0 ? (
              <p className="text-sm text-muted-foreground">No learners joined this contest yet.</p>
            ) : participants.map((participant) => (
              <div key={participant.id} className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{participant.username}</p>
                    <p className="text-sm text-muted-foreground">{participant.email}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={statusTone(participant.status)}>{participant.status}</Badge>
                    <p className="mt-2 text-sm text-foreground">Score: {participant.score || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Live Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.length === 0 ? (
              <p className="text-sm text-muted-foreground">Leaderboard will appear once learners submit solutions.</p>
            ) : leaderboard.map((entry) => (
              <div key={entry.userId} className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-4">
                <div>
                  <p className="font-medium text-foreground">#{entry.rank} {entry.username || 'Learner'}</p>
                  <p className="text-sm text-muted-foreground">
                    Solved {entry.problemsSolved || 0} • Attempted {entry.problemsAttempted || 0}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">{entry.score || 0}</p>
                  <Badge variant="outline">{entry.status || 'registered'}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

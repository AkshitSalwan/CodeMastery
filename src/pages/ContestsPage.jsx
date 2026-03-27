import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import apiService from '../services/apiService';

const parseRules = (rules) => {
  if (Array.isArray(rules)) return rules;
  if (typeof rules !== 'string') return [];

  try {
    const parsed = JSON.parse(rules);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return rules
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }
};

const normalizeStatus = (status) => {
  if (status === 'ongoing') return 'active';
  return status;
};

const decorateContestTiming = (contest, nowMs) => {
  if (!contest) return contest;

  const startMs = new Date(contest.start_time).getTime();
  const endMs = new Date(contest.end_time).getTime();
  const hasValidWindow = Number.isFinite(startMs) && Number.isFinite(endMs);
  const startsInSeconds = hasValidWindow ? Math.max(0, Math.floor((startMs - nowMs) / 1000)) : 0;
  const endsInSeconds = hasValidWindow ? Math.max(0, Math.floor((endMs - nowMs) / 1000)) : 0;

  let liveStatus = contest.status;
  if (hasValidWindow) {
    if (nowMs < startMs) liveStatus = 'upcoming';
    if (nowMs >= startMs && nowMs <= endMs) liveStatus = 'ongoing';
    if (nowMs > endMs) liveStatus = 'completed';
  }

  return {
    ...contest,
    status: liveStatus,
    startsInSeconds,
    endsInSeconds,
    isCommencementOpen: hasValidWindow ? nowMs >= startMs && nowMs <= endMs : false,
  };
};

const getStatusColor = (status) => {
  const normalized = normalizeStatus(status);
  switch (normalized) {
    case 'active':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    case 'upcoming':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    case 'completed':
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (status) => {
  const normalized = normalizeStatus(status);
  switch (normalized) {
    case 'active':
      return '🔴';
    case 'upcoming':
      return '⏳';
    case 'completed':
      return '✅';
    default:
      return '❓';
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatSeconds = (seconds) => {
  const safe = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

export function ContestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [selectedContest, setSelectedContest] = useState(null);
  const [filter, setFilter] = useState('all');
  const [contests, setContests] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState(false);
  const [error, setError] = useState('');
  const [nowMs, setNowMs] = useState(() => Date.now());

  const isInterviewer = user?.role === 'interviewer' || user?.role === 'admin';

  const loadContests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.contests.getAll();
      const nextContests = data?.contests || [];
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
      setError(loadError.message || 'Failed to load contests');
      setContests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContests();
    const interval = setInterval(loadContests, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadSelectedContest = async () => {
      if (!selectedContestId) {
        setSelectedContest(null);
        setLeaderboard([]);
        return;
      }

      try {
        const [contestData, leaderboardData] = await Promise.all([
          apiService.contests.get(selectedContestId),
          apiService.contests.leaderboard(selectedContestId),
        ]);

        setSelectedContest({
          ...(contestData?.contest || {}),
          participation: contestData?.participation || null,
          rulesList: parseRules(contestData?.contest?.rules),
        });
        setLeaderboard(leaderboardData?.leaderboard || []);
      } catch (detailError) {
        setError(detailError.message || 'Failed to load contest details');
        setSelectedContest(null);
        setLeaderboard([]);
      }
    };

    loadSelectedContest();
  }, [selectedContestId]);

  const timedContests = useMemo(
    () => contests.map((contest) => decorateContestTiming(contest, nowMs)),
    [contests, nowMs]
  );

  const timedSelectedContest = useMemo(
    () => decorateContestTiming(selectedContest, nowMs),
    [selectedContest, nowMs]
  );

  const filteredContests = useMemo(() => {
    if (filter === 'all') return timedContests;
    return timedContests.filter((contest) => normalizeStatus(contest.status) === filter);
  }, [timedContests, filter]);

  const activeCount = timedContests.filter((contest) => normalizeStatus(contest.status) === 'active').length;
  const upcomingCount = timedContests.filter((contest) => normalizeStatus(contest.status) === 'upcoming').length;

  const handleRegister = async () => {
    if (!selectedContest) return;
    setBusyAction(true);
    setError('');
    try {
      await apiService.contests.register(selectedContest.id);
      await loadContests();
      const refreshed = await apiService.contests.get(selectedContest.id);
      setSelectedContest({
        ...(refreshed?.contest || {}),
        participation: refreshed?.participation || null,
        rulesList: parseRules(refreshed?.contest?.rules),
      });
    } catch (actionError) {
      setError(actionError.message || 'Failed to register for contest');
    } finally {
      setBusyAction(false);
    }
  };

  const handleCommence = async () => {
    if (!selectedContest) return;
    setBusyAction(true);
    setError('');
    try {
      const joined = await apiService.contests.join(selectedContest.id);
      const joinedProblems = joined?.problems || [];

      if (joinedProblems.length > 0) {
        const firstProblem = joinedProblems[0];
        navigate(`/problems/${firstProblem.id}/editor?contestId=${selectedContest.id}&problemId=${firstProblem.id}`);
      }

      await loadContests();
      const leaderboardData = await apiService.contests.leaderboard(selectedContest.id);
      setLeaderboard(leaderboardData?.leaderboard || []);
    } catch (actionError) {
      setError(actionError.message || 'Unable to commence this contest right now');
    } finally {
      setBusyAction(false);
    }
  };

  const getActionConfig = () => {
    if (!selectedContest || isInterviewer) {
      return { label: 'View Leaderboard', onClick: () => {}, disabled: true };
    }

    const participationStatus = timedSelectedContest?.participation?.status || 'not_registered';
    const isActive =
      timedSelectedContest?.isCommencementOpen || normalizeStatus(timedSelectedContest?.status) === 'active';

    if (normalizeStatus(timedSelectedContest?.status) === 'completed') {
      return { label: 'Contest Completed', onClick: () => {}, disabled: true };
    }

    if (participationStatus === 'not_registered') {
      return { label: 'Register for Contest', onClick: handleRegister, disabled: busyAction };
    }

    if (!isActive) {
      return { label: 'Awaiting Commencement', onClick: () => {}, disabled: true };
    }

    return { label: 'Commence Contest', onClick: handleCommence, disabled: busyAction };
  };

  const actionConfig = getActionConfig();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isInterviewer ? 'Contest Management' : 'Contests'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isInterviewer
            ? 'Track learner participation, contest schedule, and leaderboard performance'
            : 'Join contests, commence on time, and compete on testcase-based scoring'}
        </p>
      </div>

      {isInterviewer && (
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => navigate('/contests/new')}
        >
          + Create New Contest
        </Button>
      )}

      {error ? (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900/40">
          <CardContent className="p-4 text-sm text-red-700 dark:text-red-300">{error}</CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-accent">{activeCount}</div>
            <div className="text-sm text-muted-foreground mt-2">Active Contests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-accent">{upcomingCount}</div>
            <div className="text-sm text-muted-foreground mt-2">Upcoming Contests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-accent">
              {contests.reduce((sum, contest) => sum + (contest.participants_count || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-2">Total Participants</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-accent">{contests.length}</div>
            <div className="text-sm text-muted-foreground mt-2">Total Contests</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'active', 'upcoming', 'completed'].map((key) => (
          <Button
            key={key}
            onClick={() => setFilter(key)}
            variant={filter === key ? 'default' : 'outline'}
            className={filter === key ? 'bg-accent text-accent-foreground' : ''}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">Loading contests...</CardContent>
            </Card>
          ) : null}

          {!loading && filteredContests.map((contest) => (
            <Card
              key={contest.id}
              className={`cursor-pointer transition-all ${selectedContestId === contest.id ? 'border-accent bg-accent/10' : 'hover:border-accent/50'}`}
              onClick={() => setSelectedContestId(contest.id)}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-foreground">{contest.title}</h3>
                      <span className="text-xs font-mono text-muted-foreground">#{contest.id}</span>
                      <span className={`${getStatusColor(contest.status)} text-xs font-semibold px-2 py-1 rounded-full`}>
                        {getStatusIcon(contest.status)} {normalizeStatus(contest.status).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{contest.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 py-3 border-y border-border">
                  <div>
                    <div className="text-xs text-muted-foreground">Problems</div>
                    <div className="font-semibold text-foreground">{(contest.problems || []).length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Participants</div>
                    <div className="font-semibold text-foreground">
                      {contest.participants_count || 0}/{contest.max_participants || '∞'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Starts</div>
                    <div className="font-semibold text-foreground">{formatDate(contest.start_time)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Ends</div>
                    <div className="font-semibold text-foreground">{formatDate(contest.end_time)}</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Created by {contest.creator?.username || 'Interviewer'}
                </div>
              </CardContent>
            </Card>
          ))}

          {!loading && filteredContests.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <p className="text-lg font-semibold text-foreground mb-2">No {filter} contests</p>
                <p className="text-muted-foreground">Create one or check back later.</p>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="lg:col-span-1">
          {timedSelectedContest ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {timedSelectedContest.title}
                    <span className="ml-2 text-xs font-mono text-muted-foreground">#{timedSelectedContest.id}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Contest Window</p>
                    <p className="text-sm text-foreground">Starts: {formatDate(timedSelectedContest.start_time)}</p>
                    <p className="text-sm text-foreground">Ends: {formatDate(timedSelectedContest.end_time)}</p>
                  </div>

                  <div className="rounded-lg bg-secondary/30 p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Commencement Timer</p>
                    {normalizeStatus(timedSelectedContest.status) === 'upcoming' ? (
                      <p className="text-lg font-semibold text-foreground">Starts in {formatSeconds(timedSelectedContest.startsInSeconds)}</p>
                    ) : null}
                    {normalizeStatus(timedSelectedContest.status) === 'active' ? (
                      <p className="text-lg font-semibold text-foreground">Time left {formatSeconds(timedSelectedContest.endsInSeconds)}</p>
                    ) : null}
                    {normalizeStatus(timedSelectedContest.status) === 'completed' ? (
                      <p className="text-lg font-semibold text-foreground">Contest completed</p>
                    ) : null}
                  </div>

                  {timedSelectedContest.participation ? (
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs font-semibold text-muted-foreground">Your Participation</p>
                      <p className="text-sm text-foreground mt-1">Status: {timedSelectedContest.participation.status}</p>
                      <p className="text-sm text-foreground">Score: {timedSelectedContest.participation.score || 0}</p>
                      <p className="text-sm text-foreground">Rank: {timedSelectedContest.participation.rank || '-'}</p>
                    </div>
                  ) : null}

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Problems</p>
                    <div className="space-y-2">
                      {(timedSelectedContest.contestProblems || []).length > 0 ? timedSelectedContest.contestProblems.map((problem) => (
                        <div key={problem.id} className="rounded-lg border border-border p-3">
                          <p className="text-sm font-semibold text-foreground">{problem.title}</p>
                          <p className="text-xs text-muted-foreground">Difficulty: {problem.difficulty}</p>
                          {timedSelectedContest.isCommencementOpen ? (
                            <Button
                              className="mt-2"
                              size="sm"
                              onClick={() => navigate(`/problems/${problem.id}/editor?contestId=${timedSelectedContest.id}&problemId=${problem.id}`)}
                            >
                              Solve in Contest
                            </Button>
                          ) : null}
                        </div>
                      )) : (
                        <p className="text-sm text-muted-foreground">Problem list unlocks at commencement.</p>
                      )}
                    </div>
                  </div>

                  {timedSelectedContest.rulesList?.length > 0 ? (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Rules</p>
                      <ul className="space-y-1">
                        {timedSelectedContest.rulesList.map((rule, index) => (
                          <li key={`${rule}-${index}`} className="text-sm text-foreground">• {rule}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {!isInterviewer ? (
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={actionConfig.disabled} onClick={actionConfig.onClick}>
                      {busyAction ? 'Please wait...' : actionConfig.label}
                    </Button>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Leaderboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {leaderboard.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No submissions yet.</p>
                  ) : leaderboard.slice(0, 15).map((entry) => (
                    <div key={entry.userId} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="font-medium text-foreground">#{entry.rank} {entry.username || 'Learner'}</p>
                        <p className="text-xs text-muted-foreground">
                          Solved: {entry.problemsSolved || 0} • Attempted: {entry.problemsAttempted || 0}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{entry.score || 0}</p>
                        <p className="text-xs text-muted-foreground">{formatSeconds(entry.totalTime || 0)}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                Select a contest to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

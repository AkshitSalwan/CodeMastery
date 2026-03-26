import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth-token');

  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
};

export function DailyChallengesPage() {
  const { user } = useAuth();
  const [todayData, setTodayData] = useState(null);
  const [streakData, setStreakData] = useState({ currentStreak: 0, maxStreak: 0, recentProgress: [] });
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  const fetchJson = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `Request failed: ${response.status}`);
    }

    return data;
  };

  const loadDailyChallengeData = async () => {
    setLoading(true);
    setError('');

    try {
      const [today, streak, historyData, leaderboardData] = await Promise.all([
        fetchJson('/api/dpp/today'),
        fetchJson('/api/dpp/streak'),
        fetchJson('/api/dpp/history'),
        fetchJson('/api/dpp/leaderboard'),
      ]);

      setTodayData(today);
      setStreakData(streak);
      setHistory(historyData.history || []);
      setLeaderboard(leaderboardData.leaderboard || []);
    } catch (loadError) {
      console.error('Failed to load daily challenge data:', loadError);
      setError(loadError.message || 'Unable to load daily challenges.');
    } finally {
      setLoading(false);
    }
  };

  const syncProgress = async () => {
    setSyncing(true);
    setError('');

    try {
      await fetchJson('/api/dpp/update', { method: 'POST' });
      await loadDailyChallengeData();
    } catch (syncError) {
      console.error('Failed to sync daily challenge progress:', syncError);
      setError(syncError.message || 'Unable to sync progress.');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadDailyChallengeData();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadDailyChallengeData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const challenges = useMemo(() => {
    const problems = todayData?.problems || [];

    return problems.map((problem, index) => ({
      id: problem.id,
      order: index + 1,
      date: todayData?.date || new Date().toISOString().split('T')[0],
      difficulty: String(problem.difficulty || '').replace(/^./, (char) => char.toUpperCase()),
      points: Number(problem.points || 0),
      completed: problem.userStatus === 'accepted',
      completedAt: problem.userStatus === 'accepted' ? todayData?.date : null,
      attempts: problem.userStatus === 'not_attempted' ? 0 : 1,
      problem,
    }));
  }, [todayData]);

  useEffect(() => {
    if (challenges.length > 0) {
      setSelectedChallenge((current) => current && challenges.some((item) => item.id === current.id)
        ? challenges.find((item) => item.id === current.id)
        : challenges[0]);
    } else {
      setSelectedChallenge(null);
    }
  }, [challenges]);

  const completedToday = challenges.filter((challenge) => challenge.completed).length;
  const totalChallenges = challenges.length;
  const remainingToday = Math.max(totalChallenges - completedToday, 0);
  const totalCompletedPoints = challenges
    .filter((challenge) => challenge.completed)
    .reduce((sum, challenge) => sum + challenge.points, 0);
  const currentStreak = streakData.currentStreak || 0;
  const progressPercent = totalChallenges > 0 ? Math.round((completedToday / totalChallenges) * 100) : 0;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 dark:text-green-400';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Hard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getDifficultyBg = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'Medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'Hard':
        return 'bg-red-100 dark:bg-red-900/30';
      default:
        return 'bg-muted';
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-muted-foreground">Loading daily challenges...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Daily Challenges</h1>
        <p className="text-muted-foreground mt-1">
          Complete today&apos;s database-backed challenge set and track your streak.
        </p>
      </div>

      {error ? (
        <Card className="border-destructive/30">
          <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-accent">{completedToday}</div>
            <div className="mt-2 text-sm text-muted-foreground">Completed Today</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-accent">{currentStreak}</div>
            <div className="mt-2 text-sm text-muted-foreground">Day Streak</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Best: {streakData.maxStreak || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-accent">{totalCompletedPoints}</div>
            <div className="mt-2 text-sm text-muted-foreground">Total Points Earned Today</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold text-foreground">Today&apos;s Progress</div>
              <div className="text-sm text-muted-foreground">
                {completedToday}/{totalChallenges || 0} solved, {remainingToday} remaining
              </div>
            </div>
            <div className="w-full md:max-w-md">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Completion</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle>Today&apos;s Challenge Set</CardTitle>
                <Button size="sm" variant="outline" onClick={syncProgress} disabled={syncing}>
                  {syncing ? 'Syncing...' : 'Sync Progress'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`cursor-pointer rounded-lg border p-4 transition-all ${
                    selectedChallenge?.id === challenge.id
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="text-lg font-semibold text-foreground">
                          {challenge.problem.title}
                        </div>
                        {challenge.completed ? (
                          <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Completed
                          </div>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{new Date(challenge.date).toLocaleDateString()}</span>
                        <span className={`font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                      </div>

                      <div className="mt-2 text-sm">
                        <span className="font-semibold text-accent">{challenge.points} points</span>
                        <span className="ml-2 text-muted-foreground">Problem #{challenge.order}</span>
                      </div>
                    </div>

                    <Link to={`/problems/${challenge.problem.id}/editor`} onClick={(event) => event.stopPropagation()}>
                      <Button className="ml-4 whitespace-nowrap">
                        {challenge.completed ? 'Review' : 'Solve'}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}

              {challenges.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No daily challenges were generated from the database yet.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {history.length > 0 ? (
                history
                  .slice()
                  .reverse()
                  .map((entry) => (
                    <div key={entry.date} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                      <div>
                        <div className="font-medium text-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                        <div className="text-muted-foreground">
                          {entry.problems_solved}/{entry.total_problems} solved
                        </div>
                      </div>
                      <div className={entry.completed ? 'text-green-600' : 'text-yellow-600'}>
                        {entry.completed ? 'Completed' : 'In Progress'}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-sm text-muted-foreground">No DPP history yet.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {selectedChallenge ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Challenge Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-muted-foreground">Title</h3>
                  <p className="font-semibold text-foreground">{selectedChallenge.problem.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">Difficulty</p>
                    <div
                      className={`${getDifficultyBg(selectedChallenge.difficulty)} ${getDifficultyColor(
                        selectedChallenge.difficulty
                      )} rounded-lg px-3 py-2 text-center text-sm font-semibold`}
                    >
                      {selectedChallenge.difficulty}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">Points</p>
                    <div className="rounded-lg bg-accent/10 px-3 py-2 text-center text-sm font-semibold text-accent">
                      {selectedChallenge.points}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold text-muted-foreground">Date</p>
                  <p className="text-foreground">
                    {new Date(selectedChallenge.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold text-muted-foreground">Description</p>
                  <p className="text-sm leading-relaxed text-foreground">
                    {selectedChallenge.problem.description}
                  </p>
                </div>

                {selectedChallenge.completed ? (
                  <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                      Completed on {new Date(selectedChallenge.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : null}

                <div className="text-xs text-muted-foreground">
                  Signed in as <span className="font-semibold">{user?.email}</span>
                </div>

                <Link to={`/problems/${selectedChallenge.problem.id}/editor`}>
                  <Button className="w-full">
                    {selectedChallenge.completed ? 'Review Solution' : 'Start Challenge'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <div className="mb-3 text-3xl">Select</div>
                <p className="text-sm text-muted-foreground">Select a challenge to view details.</p>
              </CardContent>
            </Card>
          )}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.length > 0 ? (
                leaderboard.slice(0, 8).map((entry) => (
                  <div key={entry.userId} className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium text-foreground">
                        #{entry.rank} {entry.username}
                      </div>
                      <div className="text-muted-foreground">Max streak {entry.maxStreak}</div>
                    </div>
                    <div className="font-semibold text-accent">{entry.currentStreak}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No leaderboard data yet.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

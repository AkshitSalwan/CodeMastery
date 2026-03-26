import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';

const fetchJson = async (url) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }

  return data;
};

export function LeaderboardPage() {
  const { profile } = useAuth();
  const [sortBy, setSortBy] = useState('streak');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await fetchJson('/api/dpp/leaderboard');
        setLeaderboard(data.leaderboard || []);
      } catch (loadError) {
        console.error('Failed to load leaderboard:', loadError);
        setError(loadError.message || 'Unable to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const currentUserData = {
    userId: profile?.id || 'current-user',
    username: profile?.name || profile?.email || 'User',
    avatar: profile?.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${profile?.name || 'User'}`,
    points: profile?.totalPoints || 0,
    problemsSolved: profile?.problemsSolved || 0,
    currentStreak: profile?.streak || 0,
    maxStreak: profile?.streak || 0,
    todaySolved: 0,
    todayAttempted: 0,
    totalProblems: 0,
    completedToday: false,
  };

  const normalizedLeaderboard = useMemo(() => {
    const apiRows = leaderboard.map((entry) => ({
      userId: entry.userId,
      username: entry.username,
      avatar: entry.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${entry.username || entry.userId}`,
      points: 0,
      problemsSolved: 0,
      currentStreak: entry.currentStreak || 0,
      maxStreak: entry.maxStreak || 0,
      todaySolved: entry.todaySolved || 0,
      todayAttempted: entry.todayAttempted || 0,
      totalProblems: entry.totalProblems || 0,
      completedToday: Boolean(entry.completedToday),
    }));

    const mergedRows = apiRows.some((entry) => String(entry.userId) === String(currentUserData.userId))
      ? apiRows.map((entry) =>
          String(entry.userId) === String(currentUserData.userId)
            ? {
                ...entry,
                points: currentUserData.points,
                problemsSolved: currentUserData.problemsSolved,
                avatar: currentUserData.avatar,
              }
            : entry
        )
      : [
          ...apiRows,
          currentUserData,
        ];

    const sortedRows = [...mergedRows].sort((left, right) => {
      switch (sortBy) {
        case 'solved':
          return right.todaySolved - left.todaySolved || right.currentStreak - left.currentStreak;
        case 'points':
          return right.points - left.points || right.currentStreak - left.currentStreak;
        case 'streak':
        default:
          return right.currentStreak - left.currentStreak || right.maxStreak - left.maxStreak;
      }
    });

    return sortedRows.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      isCurrentUser: String(entry.userId) === String(currentUserData.userId),
    }));
  }, [leaderboard, sortBy, currentUserData]);

  const getMedal = (rank) => {
    if (rank === 1) return '1';
    if (rank === 2) return '2';
    if (rank === 3) return '3';
    return '';
  };

  if (loading) {
    return <div className="py-12 text-center text-muted-foreground">Loading leaderboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Daily Challenge Leaderboard</h1>
        <p className="mt-1 text-muted-foreground">
          Live rankings from database-backed DPP progress and streaks.
        </p>
      </div>

      {error ? (
        <Card className="border-destructive/30">
          <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      <Card className="border-accent/50 bg-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={currentUserData.avatar} alt={currentUserData.username} className="h-12 w-12 rounded-full" />
              <div>
                <div className="text-sm text-muted-foreground">Your Stats</div>
                <div className="text-2xl font-bold text-foreground">{currentUserData.username}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-xl font-bold text-accent">{currentUserData.points}</div>
                <div className="text-xs text-muted-foreground">Points</div>
              </div>
              <div>
                <div className="text-xl font-bold text-accent">{currentUserData.problemsSolved}</div>
                <div className="text-xs text-muted-foreground">Solved</div>
              </div>
              <div>
                <div className="text-xl font-bold text-accent">{currentUserData.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={sortBy === 'streak' ? 'default' : 'outline'} onClick={() => setSortBy('streak')}>
          Current Streak
        </Button>
        <Button size="sm" variant={sortBy === 'solved' ? 'default' : 'outline'} onClick={() => setSortBy('solved')}>
          Today Solved
        </Button>
        <Button size="sm" variant={sortBy === 'points' ? 'default' : 'outline'} onClick={() => setSortBy('points')}>
          Points
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Rank</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-muted-foreground">Current Streak</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-muted-foreground">Best Streak</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-muted-foreground">Today</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-muted-foreground">Completion</th>
                </tr>
              </thead>
              <tbody>
                {normalizedLeaderboard.map((entry) => (
                  <tr
                    key={entry.userId}
                    className={`border-b border-border transition-colors hover:bg-muted/50 ${
                      entry.isCurrentUser ? 'bg-accent/10' : ''
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getMedal(entry.rank)}</span>
                        <span className="font-bold text-foreground">#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img src={entry.avatar} alt={entry.username} className="h-8 w-8 rounded-full" />
                        <div>
                          <div className="text-sm font-semibold text-foreground">{entry.username}</div>
                          {entry.isCurrentUser ? <div className="text-xs font-semibold text-accent">You</div> : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-semibold text-foreground">{entry.currentStreak}</td>
                    <td className="px-4 py-4 text-center font-semibold text-foreground">{entry.maxStreak}</td>
                    <td className="px-4 py-4 text-center font-semibold text-foreground">
                      {entry.todaySolved}/{entry.totalProblems || 0}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={entry.completedToday ? 'font-semibold text-green-600' : 'text-muted-foreground'}>
                        {entry.completedToday ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-accent">{normalizedLeaderboard.length}</div>
            <div className="mt-1 text-sm text-muted-foreground">Tracked Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-accent">
              {normalizedLeaderboard.length
                ? Math.round(normalizedLeaderboard.reduce((sum, entry) => sum + entry.todaySolved, 0) / normalizedLeaderboard.length)
                : 0}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">Average Today Solved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-accent">
              {normalizedLeaderboard.length
                ? (normalizedLeaderboard.reduce((sum, entry) => sum + entry.currentStreak, 0) / normalizedLeaderboard.length).toFixed(1)
                : '0.0'}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">Average Current Streak</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

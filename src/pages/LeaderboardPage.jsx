import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { LEADERBOARD_DATA } from '../data/leaderboard';

export function LeaderboardPage() {
  const [sortBy, setSortBy] = useState('points'); // points, solved, streak
  const { profile } = useAuth();
  const [timeframe, setTimeframe] = useState('all'); // all, week, month

  const currentUserData = {
    name: profile?.name || 'User',
    avatar: profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name || 'User'}`,
    points: profile?.totalPoints || 0,
    problemsSolved: profile?.problemsSolved || 0,
    streak: profile?.streak || 0,
  };

  const leaderboardWithUser = [
    ...LEADERBOARD_DATA.filter(u => u.id !== 'user-1'), // Remove placeholder user
    {
      id: profile?.id || 'current-user',
      name: currentUserData.name,
      avatar: currentUserData.avatar,
      points: currentUserData.points,
      problemsSolved: currentUserData.problemsSolved,
      streak: currentUserData.streak,
      contests: profile?.contests || 0,
      avgRating: 4.0,
    }
  ].sort((a, b) => {
    switch (sortBy) {
      case 'solved':
        return b.problemsSolved - a.problemsSolved;
      case 'streak':
        return b.streak - a.streak;
      case 'points':
      default:
        return b.points - a.points;
    }
  }).map((user, index) => ({ ...user, rank: index + 1 }));

  const sortedLeaderboard = leaderboardWithUser;

  const getMedalEmoji = rank => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Global Leaderboard</h1>
        <p className="text-muted-foreground mt-1">
          See how you rank against other developers worldwide
        </p>
      </div>

      {/* User's Current Stats - hide for interviewers */}
      {profile?.role !== 'interviewer' && (
        <Card className="border-accent/50 bg-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={currentUserData.avatar}
                  alt={currentUserData.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="text-sm text-muted-foreground">Your Stats</div>
                  <div className="text-2xl font-bold text-foreground">{currentUserData.name}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-xl font-bold text-accent">{currentUserData.points}</div>
                  <div className="text-xs text-muted-foreground">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-accent">{currentUserData.problemsSolved}</div>
                  <div className="text-xs text-muted-foreground">Solved</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-accent">{currentUserData.streak}</div>
                  <div className="text-xs text-muted-foreground">Streak</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Sort By</label>
          <div className="flex gap-2">
            <Button
              onClick={() => setSortBy('points')}
              variant={sortBy === 'points' ? 'default' : 'outline'}
              className={sortBy === 'points' ? 'bg-accent text-accent-foreground' : ''}
              size="sm"
            >
              Points
            </Button>
            <Button
              onClick={() => setSortBy('solved')}
              variant={sortBy === 'solved' ? 'default' : 'outline'}
              className={sortBy === 'solved' ? 'bg-accent text-accent-foreground' : ''}
              size="sm"
            >
              Problems Solved
            </Button>
            <Button
              onClick={() => setSortBy('streak')}
              variant={sortBy === 'streak' ? 'default' : 'outline'}
              className={sortBy === 'streak' ? 'bg-accent text-accent-foreground' : ''}
              size="sm"
            >
              Streak
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Timeframe</label>
          <div className="flex gap-2">
            <Button
              onClick={() => setTimeframe('all')}
              variant={timeframe === 'all' ? 'default' : 'outline'}
              className={timeframe === 'all' ? 'bg-accent text-accent-foreground' : ''}
              size="sm"
            >
              All Time
            </Button>
            <Button
              onClick={() => setTimeframe('month')}
              variant={timeframe === 'month' ? 'default' : 'outline'}
              className={timeframe === 'month' ? 'bg-accent text-accent-foreground' : ''}
              size="sm"
            >
              This Month
            </Button>
            <Button
              onClick={() => setTimeframe('week')}
              variant={timeframe === 'week' ? 'default' : 'outline'}
              className={timeframe === 'week' ? 'bg-accent text-accent-foreground' : ''}
              size="sm"
            >
              This Week
            </Button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">
                    Rank
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">
                    User
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-sm">
                    Points
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-sm">
                    Solved
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-sm">
                    Streak
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-sm">
                    Contests
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-sm">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`border-b border-border hover:bg-muted/50 transition-colors ${
                      user.id === 'user-1' ? 'bg-accent/10' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getMedalEmoji(user.rank)}</span>
                        <span className="font-bold text-foreground">#{user.rank}</span>
                      </div>
                    </td>

                    {/* User */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-foreground text-sm">{user.name}</div>
                          {user.id === 'user-1' && (
                            <div className="text-xs text-accent font-semibold">You</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Points */}
                    <td className="py-4 px-4 text-center">
                      <div className="font-bold text-accent">{user.points.toLocaleString()}</div>
                    </td>

                    {/* Solved */}
                    <td className="py-4 px-4 text-center">
                      <div className="font-semibold text-foreground">{user.problemsSolved}</div>
                    </td>

                    {/* Streak */}
                    <td className="py-4 px-4 text-center">
                      <div className="font-semibold text-foreground flex items-center justify-center gap-1">
                        🔥 {user.streak}
                      </div>
                    </td>

                    {/* Contests */}
                    <td className="py-4 px-4 text-center">
                      <div className="font-semibold text-foreground">{user.contests}</div>
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span>⭐</span>
                        <span className="font-semibold text-foreground">{user.avgRating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {sortedLeaderboard.length.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Total Users</div>
              <div className="text-xs text-muted-foreground">Competing worldwide</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {Math.floor(
                  sortedLeaderboard.reduce((sum, u) => sum + u.problemsSolved, 0) /
                    sortedLeaderboard.length
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Avg Problems Solved</div>
              <div className="text-xs text-muted-foreground">Per user</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {(
                  sortedLeaderboard.reduce((sum, u) => sum + u.streak, 0) /
                  sortedLeaderboard.length
                ).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Avg Streak</div>
              <div className="text-xs text-muted-foreground">Days</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

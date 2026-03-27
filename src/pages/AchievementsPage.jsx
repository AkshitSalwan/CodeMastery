import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export function AchievementsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all'); // all, unlocked, locked
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          setError('Please log in to view achievements');
          setLoading(false);
          return;
        }

        // Get token from localStorage - required for user badges
        const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        // Fetch all badges (no auth needed)
        const badgesResponse = await fetch('/api/badges/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!badgesResponse.ok) {
          throw new Error('Failed to fetch badges');
        }

        const badgesData = await badgesResponse.json();
        const allBadges = badgesData.badges || [];

        // Fetch user's earned badges (with auth)
        const userBadgesResponse = await fetch('/api/badges/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!userBadgesResponse.ok) {
          if (userBadgesResponse.status === 401) {
            setError('Authentication failed. Please log in again.');
            localStorage.removeItem('auth-token');
            localStorage.removeItem('token');
          } else {
            console.warn(`Failed to fetch user badges: ${userBadgesResponse.status}`);
            // Continue anyway with empty earned badges
            setAchievements(
              allBadges.map((badge) => ({
                ...badge,
                unlocked: false,
                progress: 0,
                total: 100,
              }))
            );
          }
          setLoading(false);
          return;
        }

        const userBadgesData = await userBadgesResponse.json();
        const earnedBadgeIds = new Set(
          (userBadgesData.badges || []).map((ub) => ub.badge_id)
        );

        // Combine badge data with earned status
        const combinedAchievements = allBadges.map((badge) => ({
          ...badge,
          unlocked: earnedBadgeIds.has(badge.id),
          unlockedDate: userBadgesData.badges?.find(
            (ub) => ub.badge_id === badge.id
          )?.earned_at,
          progress: earnedBadgeIds.has(badge.id) ? 100 : 0,
          total: 100,
        }));

        setAchievements(combinedAchievements);
        setUserAchievements(userBadgesData.badges || []);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  const filteredAchievements = achievements.filter((achievement) => {
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + (a.points || 0), 0);
  const progressPercentage =
    achievements.length > 0
      ? Math.round((unlockedCount / achievements.length) * 100)
      : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
          <p className="text-muted-foreground mt-1">
            Unlock achievements by completing challenges and solving problems
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
        <p className="text-muted-foreground mt-1">
          Unlock achievements by completing challenges and solving problems
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">{unlockedCount}</div>
              <div className="text-sm text-muted-foreground mt-2">
                Achievements Unlocked
              </div>
              <div className="text-lg font-semibold text-foreground mt-1">
                {achievements.length - unlockedCount} remaining
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">{totalPoints}</div>
              <div className="text-sm text-muted-foreground mt-2">Total Points</div>
              <div className="text-xs text-muted-foreground mt-1">
                From achievements
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">
                {progressPercentage}%
              </div>
              <div className="text-sm text-muted-foreground mt-2">Progress</div>
              <div className="text-xs text-muted-foreground mt-1">Keep going!</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">
                {userAchievements.length}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Badges Earned
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Keep collecting!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-foreground">Overall Progress</h3>
              <span className="text-sm text-muted-foreground">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div
                className="bg-accent h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          className={filter === 'all' ? 'bg-accent text-accent-foreground' : ''}
        >
          All ({achievements.length})
        </Button>
        <Button
          onClick={() => setFilter('unlocked')}
          variant={filter === 'unlocked' ? 'default' : 'outline'}
          className={
            filter === 'unlocked' ? 'bg-accent text-accent-foreground' : ''
          }
        >
          Unlocked ({unlockedCount})
        </Button>
        <Button
          onClick={() => setFilter('locked')}
          variant={filter === 'locked' ? 'default' : 'outline'}
          className={filter === 'locked' ? 'bg-accent text-accent-foreground' : ''}
        >
          Locked ({achievements.length - unlockedCount})
        </Button>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`transition-all ${
              achievement.unlocked
                ? 'border-accent/50 bg-accent/5'
                : 'opacity-60 border-muted'
            }`}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Icon and Badge */}
                <div className="flex justify-between items-start">
                  <div className="text-4xl">{achievement.icon}</div>
                  {achievement.unlocked && (
                    <div className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded-full">
                      Unlocked
                    </div>
                  )}
                  {!achievement.unlocked && (
                    <div className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-1 rounded-full">
                      Locked
                    </div>
                  )}
                </div>

                {/* Name and Description */}
                <div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                </div>

                {/* Rarity Badge */}
                {achievement.rarity && (
                  <div className="text-xs uppercase tracking-wide font-semibold">
                    <span
                      className="px-2 py-1 rounded"
                      style={{
                        backgroundColor: achievement.color + '20',
                        color: achievement.color,
                      }}
                    >
                      {achievement.rarity}
                    </span>
                  </div>
                )}

                {/* Points and Date */}
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm font-semibold text-accent">
                    {achievement.points || 0} points
                  </span>
                  {achievement.unlocked && achievement.unlockedDate && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-lg font-semibold text-foreground mb-2">
              No achievements yet
            </p>
            <p className="text-muted-foreground">
              Start solving problems to unlock achievements
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

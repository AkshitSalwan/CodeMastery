import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { ACHIEVEMENTS } from '../data/achievements';

export function AchievementsPage() {
  const [filter, setFilter] = useState('all'); // all, unlocked, locked

  const filteredAchievements = ACHIEVEMENTS.filter(achievement => {
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });

  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;
  const totalPoints = ACHIEVEMENTS.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const progressPercentage = Math.round((unlockedCount / ACHIEVEMENTS.length) * 100);

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
              <div className="text-sm text-muted-foreground mt-2">Achievements Unlocked</div>
              <div className="text-lg font-semibold text-foreground mt-1">
                {ACHIEVEMENTS.length - unlockedCount} remaining
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">{totalPoints}</div>
              <div className="text-sm text-muted-foreground mt-2">Total Points</div>
              <div className="text-xs text-muted-foreground mt-1">From achievements</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">{progressPercentage}%</div>
              <div className="text-sm text-muted-foreground mt-2">Progress</div>
              <div className="text-xs text-muted-foreground mt-1">Keep going!</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">12</div>
              <div className="text-sm text-muted-foreground mt-2">Current Streak</div>
              <div className="text-xs text-muted-foreground mt-1">Days in a row</div>
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
              <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
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
          All ({ACHIEVEMENTS.length})
        </Button>
        <Button
          onClick={() => setFilter('unlocked')}
          variant={filter === 'unlocked' ? 'default' : 'outline'}
          className={filter === 'unlocked' ? 'bg-accent text-accent-foreground' : ''}
        >
          Unlocked ({unlockedCount})
        </Button>
        <Button
          onClick={() => setFilter('locked')}
          variant={filter === 'locked' ? 'default' : 'outline'}
          className={filter === 'locked' ? 'bg-accent text-accent-foreground' : ''}
        >
          Locked ({ACHIEVEMENTS.length - unlockedCount})
        </Button>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => (
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
                </div>

                {/* Name and Description */}
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-accent h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (achievement.progress / achievement.total) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Points and Date */}
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm font-semibold text-accent">{achievement.points} points</span>
                  {achievement.unlocked && achievement.unlockedDate && (
                    <span className="text-xs text-muted-foreground">
                      {achievement.unlockedDate.toLocaleDateString()}
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
            <p className="text-lg font-semibold text-foreground mb-2">No achievements yet</p>
            <p className="text-muted-foreground">
              Start solving problems to unlock achievements
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

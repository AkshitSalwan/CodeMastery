import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { DAILY_CHALLENGES } from '../data/achievements';

export function DailyChallengesPage() {
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const completedToday = DAILY_CHALLENGES.filter(
    challenge =>
      challenge.completed &&
      new Date(challenge.completedAt).toDateString() === new Date().toDateString()
  ).length;

  const totalCompletedPoints = DAILY_CHALLENGES.filter(challenge => challenge.completed).reduce(
    (sum, challenge) => sum + challenge.points,
    0
  );

  const streak = DAILY_CHALLENGES.filter(c => c.completed).length; // Simplified streak calculation

  const getDifficultyColor = difficulty => {
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

  const getDifficultyBg = difficulty => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Daily Challenges</h1>
        <p className="text-muted-foreground mt-1">
          Complete a challenge every day to build your skills and maintain your streak
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">{completedToday}</div>
              <div className="text-sm text-muted-foreground mt-2">Completed Today</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">{streak}</div>
              <div className="text-sm text-muted-foreground mt-2">Day Streak</div>
              <div className="text-xs text-muted-foreground mt-1">🔥 Keep it up!</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">{totalCompletedPoints}</div>
              <div className="text-sm text-muted-foreground mt-2">Total Points Earned</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Challenges List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Today & Recent Challenges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {DAILY_CHALLENGES.map(challenge => (
                <div
                  key={challenge.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedChallenge?.id === challenge.id
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-lg font-semibold text-foreground">
                          {challenge.problem.title}
                        </div>

                        {/* Status Badge */}
                        {challenge.completed && (
                          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-2 py-1 rounded-full">
                            ✓ Completed
                          </div>
                        )}
                        {!challenge.completed && challenge.attempts > 0 && (
                          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full">
                            ⚡ In Progress
                          </div>
                        )}
                      </div>

                      {/* Date and Difficulty */}
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{challenge.date.toLocaleDateString()}</span>
                        <span
                          className={`font-semibold ${getDifficultyColor(
                            challenge.difficulty
                          )}`}
                        >
                          {challenge.difficulty}
                        </span>
                      </div>

                      {/* Points */}
                      <div className="mt-2 text-sm">
                        <span className="text-accent font-semibold">{challenge.points} points</span>
                        {challenge.completed && (
                          <span className="text-muted-foreground ml-2">
                            ({challenge.attempts} attempt{challenge.attempts !== 1 ? 's' : ''})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="ml-4 whitespace-nowrap"
                      onClick={e => {
                        e.stopPropagation();
                      }}
                    >
                      {challenge.completed ? 'Review' : 'Solve'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Challenge Details */}
        <div className="lg:col-span-1">
          {selectedChallenge ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Challenge Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Title</h3>
                  <p className="font-semibold text-foreground">
                    {selectedChallenge.problem.title}
                  </p>
                </div>

                {/* Difficulty and Points */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Difficulty</p>
                    <div
                      className={`${getDifficultyBg(
                        selectedChallenge.difficulty
                      )} ${getDifficultyColor(
                        selectedChallenge.difficulty
                      )} text-center font-semibold px-3 py-2 rounded-lg text-sm`}
                    >
                      {selectedChallenge.difficulty}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Points</p>
                    <div className="bg-accent/10 text-accent text-center font-semibold px-3 py-2 rounded-lg text-sm">
                      {selectedChallenge.points}
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Date</p>
                  <p className="text-foreground">
                    {selectedChallenge.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedChallenge.problem.description}
                  </p>
                </div>

                {/* Status */}
                {selectedChallenge.completed && (
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400 font-semibold">
                      ✓ Completed on{' '}
                      {new Date(selectedChallenge.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Attempts */}
                {selectedChallenge.attempts > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Attempts: <span className="font-semibold">{selectedChallenge.attempts}</span>
                  </div>
                )}

                {/* Action Button */}
                <Button className="w-full">
                  {selectedChallenge.completed ? 'View Solution' : 'Start Challenge'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <div className="text-3xl mb-3">👈</div>
                <p className="text-sm text-muted-foreground">
                  Select a challenge to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

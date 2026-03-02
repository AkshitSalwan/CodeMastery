import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { CONTESTS } from '../data/contests';

export function ContestsPage() {
  const { user } = useAuth();
  const [selectedContest, setSelectedContest] = useState(null);
  const [filter, setFilter] = useState('active'); // all, active, upcoming, completed

  const isInterviewer = user?.role === 'interviewer';

  const filteredContests = CONTESTS.filter(contest => {
    if (filter === 'all') return true;
    return contest.status === filter;
  });

  const getStatusColor = status => {
    switch (status) {
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

  const getStatusIcon = status => {
    switch (status) {
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

  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isInterviewer ? 'Contest Management' : 'Contests'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isInterviewer
            ? 'Create and manage coding contests for your candidates'
            : 'Join contests, compete with others, and win prizes'}
        </p>
      </div>

      {/* Create Contest Button (Interviewer Only) */}
      {isInterviewer && (
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          + Create New Contest
        </Button>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">
                {filteredContests.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground mt-2">Active Contests</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">
                {filteredContests.filter(c => c.status === 'upcoming').length}
              </div>
              <div className="text-sm text-muted-foreground mt-2">Upcoming Contests</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">
                {CONTESTS.reduce((sum, c) => sum + c.participants, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-2">Total Participants</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">
                {CONTESTS.filter(c => c.participationStatus === 'joined').length}
              </div>
              <div className="text-sm text-muted-foreground mt-2">Joined Contests</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          className={filter === 'all' ? 'bg-accent text-accent-foreground' : ''}
        >
          All
        </Button>
        <Button
          onClick={() => setFilter('active')}
          variant={filter === 'active' ? 'default' : 'outline'}
          className={filter === 'active' ? 'bg-accent text-accent-foreground' : ''}
        >
          Active
        </Button>
        <Button
          onClick={() => setFilter('upcoming')}
          variant={filter === 'upcoming' ? 'default' : 'outline'}
          className={filter === 'upcoming' ? 'bg-accent text-accent-foreground' : ''}
        >
          Upcoming
        </Button>
        <Button
          onClick={() => setFilter('completed')}
          variant={filter === 'completed' ? 'default' : 'outline'}
          className={filter === 'completed' ? 'bg-accent text-accent-foreground' : ''}
        >
          Completed
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contests List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {filteredContests.map(contest => (
              <Card
                key={contest.id}
                className={`cursor-pointer transition-all ${
                  selectedContest?.id === contest.id
                    ? 'border-accent bg-accent/10'
                    : 'hover:border-accent/50'
                }`}
                onClick={() => setSelectedContest(contest)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-foreground">
                            {contest.title}
                          </h3>
                          <span
                            className={`${getStatusColor(
                              contest.status
                            )} text-xs font-semibold px-2 py-1 rounded-full`}
                          >
                            {getStatusIcon(contest.status)} {contest.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{contest.description}</p>
                      </div>
                    </div>

                    {/* Info Row */}
                    <div className="flex flex-wrap gap-4 py-3 border-y border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📋</span>
                        <div>
                          <div className="text-xs text-muted-foreground">Problems</div>
                          <div className="font-semibold text-foreground">
                            {contest.totalProblems}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-2xl">👥</span>
                        <div>
                          <div className="text-xs text-muted-foreground">Participants</div>
                          <div className="font-semibold text-foreground">
                            {contest.participants.toLocaleString()}/{contest.maxParticipants}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-2xl">⏱️</span>
                        <div>
                          <div className="text-xs text-muted-foreground">Duration</div>
                          <div className="font-semibold text-foreground">
                            {contest.duration} days
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📊</span>
                        <div>
                          <div className="text-xs text-muted-foreground">Difficulty</div>
                          <div className="font-semibold text-foreground">
                            {contest.difficulty}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Created by {contest.createdBy.name}
                        </div>
                        {contest.entryFee > 0 && (
                          <div className="text-sm font-semibold text-accent">
                            Entry Fee: ${contest.entryFee}
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={e => {
                          e.stopPropagation();
                        }}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        {contest.participationStatus === 'joined'
                          ? 'View'
                          : contest.status === 'completed'
                            ? 'View Results'
                            : 'Join'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredContests.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <p className="text-lg font-semibold text-foreground mb-2">
                  No {filter} contests
                </p>
                <p className="text-muted-foreground">
                  Check back later for more contests
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contest Details */}
        <div className="lg:col-span-1">
          {selectedContest ? (
            <div className="space-y-4">
              {/* Main Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedContest.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Status</p>
                    <span
                      className={`${getStatusColor(
                        selectedContest.status
                      )} text-xs font-semibold px-3 py-1 rounded-full inline-block`}
                    >
                      {getStatusIcon(selectedContest.status)} {selectedContest.status}
                    </span>
                  </div>

                  {/* Dates */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Start Date</p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatDate(selectedContest.startDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">End Date</p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatDate(selectedContest.endDate)}
                    </p>
                  </div>

                  {/* Your Rank (if joined) */}
                  {selectedContest.participationStatus === 'joined' && (
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-accent mb-1">Your Rank</p>
                      <p className="text-2xl font-bold text-accent">#{selectedContest.userRank}</p>
                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Topics</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedContest.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prizes */}
              {selectedContest.prize && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🏆 Prizes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">1st Place</span>
                      <span className="text-accent font-bold">{selectedContest.prize.first}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">2nd Place</span>
                      <span className="text-accent font-bold">{selectedContest.prize.second}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">3rd Place</span>
                      <span className="text-accent font-bold">{selectedContest.prize.third}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rules */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📋 Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedContest.rules.map((rule, idx) => (
                      <li key={idx} className="text-sm text-foreground flex gap-2">
                        <span className="text-accent">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Action Button */}
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-10">
                {selectedContest.participationStatus === 'joined'
                  ? 'Enter Contest'
                  : selectedContest.status === 'completed'
                    ? 'View Results'
                    : 'Join Contest'}
              </Button>
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <div className="text-3xl mb-3">←</div>
                <p className="text-sm text-muted-foreground">
                  Select a contest to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

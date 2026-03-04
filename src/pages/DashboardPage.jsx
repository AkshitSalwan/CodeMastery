import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { Flame, Trophy, Zap, Code2, Briefcase, FileText, Calendar, Users, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export function DashboardPage() {
  const { user } = useAuth();
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const activities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
    setRecentActivities(activities.slice(0, 5));
  }, []);

  const userStats = [
    { label: 'Problems Solved', value: '24', icon: Code2, color: 'text-blue-500' },
    { label: 'Current Streak', value: '7', icon: Flame, color: 'text-orange-500' },
    { label: 'Level', value: '12', icon: Zap, color: 'text-yellow-500' },
    { label: 'Achievements', value: '8', icon: Trophy, color: 'text-purple-500' },
  ];

  const interviewerStats = [
    { label: 'Tests Conducted', value: '42', icon: Briefcase, color: 'text-blue-500' },
    { label: 'Questions Created', value: '128', icon: FileText, color: 'text-green-500' },
    { label: 'Contests', value: '7', icon: Calendar, color: 'text-orange-500' },
    { label: 'Interviews', value: '19', icon: Users, color: 'text-purple-500' },
  ];

  const stats = user?.role === 'interviewer' ? interviewerStats : userStats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {user?.role === 'interviewer' ? 'Welcome Back, Interviewer!' : 'Welcome Back!'}
        </h1>
        <p className="text-muted-foreground">
          {user?.role === 'interviewer' 
            ? 'Manage interviews and track candidate performance' 
            : 'Continue your learning journey with DSA'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <Icon className={`h-12 w-12 opacity-50 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {user?.role === 'interviewer' ? (
              <>
                <Link to="/add-question">
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    New Problem
                  </Button>
                </Link>
                <Link to="/contests">
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Contests
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/problems">
                  <Button className="w-full">
                    <Code2 className="h-4 w-4 mr-2" />
                    Solve Problems
                  </Button>
                </Link>
                <Link to="/daily-challenges">
                  <Button variant="outline" className="w-full">
                    <Flame className="h-4 w-4 mr-2" />
                    Daily Challenge
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          {user?.role === 'interviewer' ? 'Recent Tests & Candidates' : 'Recent Activity'}
        </h2>
        <Card>
          <CardContent className="pt-6">
            {user?.role === 'interviewer' && recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border last:pb-0 last:border-b-0">
                    <div className="mt-1 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      {activity.type === 'test_created' ? (
                        <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{activity.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                {user?.role === 'interviewer' 
                  ? 'No recent activity. Create a test to get started!' 
                  : 'No recent activity. Start solving problems!'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Interviewer Resources */}
      {user?.role === 'interviewer' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Interviewer Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  Create Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Build custom coding tests for candidates</p>
                <Link to="/make-test">
                  <Button size="sm" variant="outline" className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Manage Candidates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Review and track candidate submissions</p>
                <Link to="/contests">
                  <Button size="sm" variant="outline" className="w-full">View All</Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-orange-500" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Monitor interview performance metrics</p>
                <Link to="/leaderboard">
                  <Button size="sm" variant="outline" className="w-full">View Metrics</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

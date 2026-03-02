import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { Flame, Trophy, Zap, Code2 } from 'lucide-react';

export function DashboardPage() {
  const stats = [
    { label: 'Problems Solved', value: '24', icon: Code2, color: 'text-blue-500' },
    { label: 'Current Streak', value: '7', icon: Flame, color: 'text-orange-500' },
    { label: 'Level', value: '12', icon: Zap, color: 'text-yellow-500' },
    { label: 'Achievements', value: '8', icon: Trophy, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome Back!</h1>
        <p className="text-muted-foreground">Continue your learning journey with DSA</p>
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
            <Link to="/problems">
              <Button className="w-full">
                <Code2 className="h-4 w-4 mr-2" />
                Solve Problems
              </Button>
            </Link>
            <Link to="/daily-challenge">
              <Button variant="outline" className="w-full">
                <Flame className="h-4 w-4 mr-2" />
                Daily Challenge
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Problems */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Recent Activity</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-8">No recent activity. Start solving problems!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

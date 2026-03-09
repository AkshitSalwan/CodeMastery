import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { Flame, Trophy, Zap, Code2, Briefcase, FileText, Calendar, Users, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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

  // Sample progress data
  const progressData = [
    { day: 'Mon', solved: 2 },
    { day: 'Tue', solved: 3 },
    { day: 'Wed', solved: 1 },
    { day: 'Thu', solved: 4 },
    { day: 'Fri', solved: 2 },
    { day: 'Sat', solved: 5 },
    { day: 'Sun', solved: 3 },
  ];

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {user?.role === 'interviewer' ? 'Welcome Back, Interviewer!' : 'Welcome Back!'}
        </h1>
        <p className="text-muted-foreground">
          {user?.role === 'interviewer' 
            ? 'Manage interviews and track candidate performance' 
            : 'Continue your learning journey with DSA'}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
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
            </motion.div>
          );
        })}
      </motion.div>

      {/* Progress Chart */}
      {user?.role !== 'interviewer' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="solved" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {user?.role === 'interviewer' ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/add-question">
                    <Button className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      New Problem
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/contests">
                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Manage Contests
                    </Button>
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/problems">
                    <Button className="w-full">
                      <Code2 className="h-4 w-4 mr-2" />
                      Solve Problems
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/daily-challenges">
                    <Button variant="outline" className="w-full">
                      <Flame className="h-4 w-4 mr-2" />
                      Daily Challenge
                    </Button>
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-foreground">
          {user?.role === 'interviewer' ? 'Recent Tests & Candidates' : 'Recent Activity'}
        </h2>
        <Card>
          <CardContent className="pt-6">
            {user?.role === 'interviewer' && recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div 
                    key={activity.id} 
                    className="flex items-start gap-4 pb-4 border-b border-border last:pb-0 last:border-b-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
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
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.p 
                className="text-muted-foreground text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                {user?.role === 'interviewer' 
                  ? 'No recent activity. Create a test to get started!' 
                  : 'No recent activity. Start solving problems!'}
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>

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
    </motion.div>
  );
}

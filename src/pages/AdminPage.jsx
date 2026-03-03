import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Code2, MessageSquare, FileText, Target, Calendar, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AdminPage() {
  const { user } = useAuth();
  const isInterviewer = user?.role === 'interviewer';

  // Platform-wide KPIs
  const platformKPIData = [
    { label: 'Total Users', value: '2,543', change: '+12%', icon: Users, color: 'text-blue-500' },
    { label: 'Total Problems', value: '847', change: '+8%', icon: Code2, color: 'text-green-500' },
    { label: 'Submissions', value: '156K', change: '+23%', icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Feedback', value: '342', change: '+5%', icon: MessageSquare, color: 'text-orange-500' },
  ];

  // Interviewer-specific KPIs
  const interviewerKPIData = [
    { label: 'Contests Created', value: '8', change: '+2', icon: Target, color: 'text-blue-500' },
    { label: 'Problems Created', value: '127', change: '+15', icon: FileText, color: 'text-green-500' },
    { label: 'Candidates Interviewed', value: '42', change: '+5', icon: Users, color: 'text-purple-500' },
    { label: 'Active Contests', value: '3', change: 'on-going', icon: Calendar, color: 'text-orange-500' },
  ];

  const kpiData = isInterviewer ? interviewerKPIData : platformKPIData;


  const activityData = [
    { day: 'Mon', submissions: 240 },
    { day: 'Tue', submissions: 221 },
    { day: 'Wed', submissions: 229 },
    { day: 'Thu', submissions: 200 },
    { day: 'Fri', submissions: 250 },
    { day: 'Sat', submissions: 210 },
    { day: 'Sun', submissions: 230 },
  ];

  const difficultyData = [
    { name: 'Easy', value: 320, fill: '#10b981' },
    { name: 'Medium', value: 410, fill: '#f59e0b' },
    { name: 'Hard', value: 117, fill: '#ef4444' },
  ];

  const submissionData = [
    { language: 'JavaScript', count: 345 },
    { language: 'Python', count: 298 },
    { language: 'Java', count: 256 },
    { language: 'C++', count: 189 },
    { language: 'C#', count: 142 },
  ];

  const recentFeedback = [
    { id: 1, user: 'John Doe', message: 'Great platform! Very helpful', rating: 5 },
    { id: 2, user: 'Jane Smith', message: 'Need more hard problems', rating: 4 },
    { id: 3, user: 'Bob Johnson', message: 'Bug found in Two Sum problem', rating: 3 },
    { id: 4, user: 'Alice Brown', message: 'Love the explanations', rating: 5 },
    { id: 5, user: 'Charlie Wilson', message: 'Can we add more categories?', rating: 4 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {isInterviewer ? 'Interviewer Dashboard' : 'Admin Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          {isInterviewer ? 'Manage contests and problems' : 'Platform analytics and insights'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{kpi.value}</p>
                    <p className="text-xs text-green-500 mt-2">{kpi.change}</p>
                  </div>
                  <Icon className={`h-8 w-8 opacity-50 ${kpi.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isInterviewer ? (
        // INTERVIEWER VIEW
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Active Contests */}
          <Card>
            <CardHeader>
              <CardTitle>Active Contests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, name: 'Weekly Challenge #5', problems: 5, participants: 234 },
                  { id: 2, name: 'Trees & Graphs Mastery', problems: 8, participants: 156 },
                  { id: 3, name: 'Dynamic Programming Sprint', problems: 10, participants: 89 },
                ].map((contest) => (
                  <div key={contest.id} className="pb-4 border-b border-border last:border-b-0">
                    <p className="font-semibold text-foreground">{contest.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {contest.problems} problems • {contest.participants} participants
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Problems Created */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Problems Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, title: 'Longest Palindromic Substring', difficulty: 'Medium', created: '2 days ago' },
                  { id: 2, title: 'Course Schedule IV', difficulty: 'Hard', created: '1 week ago' },
                  { id: 3, title: 'Majority Element', difficulty: 'Easy', created: '2 weeks ago' },
                ].map((problem) => (
                  <div key={problem.id} className="pb-4 border-b border-border last:border-b-0">
                    <p className="font-semibold text-foreground">{problem.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {problem.difficulty} • {problem.created}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // ADMIN VIEW
        <div className="space-y-6">
          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line type="monotone" dataKey="submissions" stroke="var(--accent)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Difficulty Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Problem Difficulty Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Submissions by Language */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions by Language</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={submissionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="language" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="count" fill="var(--accent)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Feedback - Admin only */}
      {!isInterviewer && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFeedback.map((feedback) => (
                <div key={feedback.id} className="pb-4 border-b border-border last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-foreground">{feedback.user}</p>
                      <p className="text-sm text-muted-foreground">{feedback.message}</p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < feedback.rating ? 'text-yellow-400' : 'text-muted-foreground'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
        </div>
      )}

    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Code2, MessageSquare } from 'lucide-react';

export function AdminPage() {
  const kpiData = [
    { label: 'Total Users', value: '2,543', change: '+12%', icon: Users, color: 'text-blue-500' },
    { label: 'Total Problems', value: '847', change: '+8%', icon: Code2, color: 'text-green-500' },
    { label: 'Submissions', value: '156K', change: '+23%', icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Feedback', value: '342', change: '+5%', icon: MessageSquare, color: 'text-orange-500' },
  ];

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
        <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform analytics and insights</p>
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
                    <p className="text-xs text-green-500 mt-2">{kpi.change} from last month</p>
                  </div>
                  <Icon className={`h-8 w-8 opacity-50 ${kpi.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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

      {/* Recent Feedback */}
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
    </div>
  );
}

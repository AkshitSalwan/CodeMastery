import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ShieldCheck, UserPlus, Users, Target, FileCode2, UserCog, Clock3, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useAuth } from '../context/AuthContext';
import { getAdminAllowlist } from '../utils/roles';

export function AdminPage() {
  const { user, assignManagedUserRole, registeredUsers } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('interviewer');
  const [apiProblems, setApiProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [deletingProblemId, setDeletingProblemId] = useState(null);

  const adminAllowlist = getAdminAllowlist();
  const managedUsers = user?.adminSettings?.managedUsers || [];
  const metrics = user?.adminSettings?.metrics || {};

  // Fetch problems from API on component mount
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoadingProblems(true);
        const res = await fetch('/api/problems');
        if (res.ok) {
          const data = await res.json();
          setApiProblems(data.problems || []);
        }
      } catch (err) {
        console.error('Error fetching problems:', err);
        setApiProblems([]);
      } finally {
        setLoadingProblems(false);
      }
    };
    
    fetchProblems();
  }, []);

  const handleDeleteProblem = async (problemId, problemTitle) => {
    const confirmed = window.confirm(`Delete problem "${problemTitle}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem('auth-token');
    if (!token) {
      window.alert('You must be logged in as admin to delete problems.');
      return;
    }

    try {
      setDeletingProblemId(problemId);
      const response = await fetch(`/api/problems/${problemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete problem.');
      }

      setApiProblems((current) => current.filter((problem) => problem.id !== problemId));
    } catch (error) {
      console.error('Delete problem error:', error);
      window.alert(error.message || 'Unable to delete problem.');
    } finally {
      setDeletingProblemId(null);
    }
  };

  const customQuestions = useMemo(() => {
    // Return API problems instead of localStorage
    return apiProblems;
  }, [apiProblems]);

  const builtTests = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('testBuilderTests') || '[]');
    } catch {
      return [];
    }
  }, []);

  const interviewerUsers = managedUsers.filter((entry) => entry.role === 'interviewer');
  const adminUsers = managedUsers.filter((entry) => entry.role === 'admin');
  const learnerUsers = registeredUsers.filter((entry) => entry.role === 'learner');

  const kpis = [
    { label: 'Allowed Admin Emails', value: adminAllowlist.length, icon: ShieldCheck, color: 'text-cyan-500' },
    { label: 'Interviewer Accounts', value: interviewerUsers.length, icon: Users, color: 'text-emerald-500' },
    { label: 'Questions Added', value: customQuestions.length + (metrics.questionsAdded || 0), icon: FileCode2, color: 'text-amber-500' },
    { label: 'Contests Arranged', value: builtTests.length + (metrics.contestsCreated || 0), icon: Target, color: 'text-rose-500' },
  ];

  const activityData = [
    { name: 'Questions', value: customQuestions.length + (metrics.questionsAdded || 0), fill: '#22c55e' },
    { name: 'Contests', value: builtTests.length + (metrics.contestsCreated || 0), fill: '#f97316' },
    { name: 'Testcases', value: metrics.testcasesDesigned || builtTests.reduce((sum, test) => sum + (test.questions?.length || 0), 0), fill: '#06b6d4' },
    { name: 'Managed Users', value: managedUsers.length, fill: '#8b5cf6' },
  ];

  const roleDistribution = [
    { name: 'Admins', value: adminAllowlist.length + adminUsers.length, fill: '#0ea5e9' },
    { name: 'Interviewers', value: interviewerUsers.length, fill: '#22c55e' },
    { name: 'Learners', value: learnerUsers.length, fill: '#f59e0b' },
  ];

  const handleAssignRole = (event) => {
    event.preventDefault();
    if (!email.trim()) return;

    assignManagedUserRole({
      email,
      name,
      role,
    });

    setEmail('');
    setName('');
    setRole('interviewer');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Admin Panel</h1>
          <p className="mt-2 text-muted-foreground">
            Control privileged accounts, platform-level metrics, and interviewer access.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/questions/add">
            <Button className="bg-amber-500 hover:bg-amber-600">
              <span>➕ Add New Question</span>
            </Button>
          </Link>
          <Link to="/questions/add">
            <Button variant="outline">Question Setup</Button>
          </Link>
          <Link to="/contests/new">
            <Button>Create Contest</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="rounded-2xl">
              <CardContent className="flex items-start justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{item.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${item.color}`} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Role Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleAssignRole} className="grid gap-4 md:grid-cols-2">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Display name"
                className="rounded-lg border border-border bg-background px-4 py-2 text-foreground"
              />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="user@example.com"
                className="rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                required
              />
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="rounded-lg border border-border bg-background px-4 py-2 text-foreground"
              >
                <option value="interviewer">Interviewer</option>
                <option value="admin">Admin</option>
                <option value="learner">Learner</option>
              </select>
              <Button type="submit" className="inline-flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Save role
              </Button>
            </form>

            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <p className="text-sm font-medium text-foreground">Bootstrap admin emails</p>
              <p className="mt-1 text-sm text-muted-foreground">
                These emails are always trusted as admins through `VITE_ADMIN_EMAILS`.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {adminAllowlist.length > 0 ? adminAllowlist.map((entry) => (
                  <Badge key={entry} variant="outline">{entry}</Badge>
                )) : <Badge variant="outline">No allowlist configured</Badge>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <p className="text-sm font-medium text-foreground">Managed Interviewers</p>
                <div className="mt-3 space-y-3">
                  {interviewerUsers.length > 0 ? interviewerUsers.map((entry) => (
                    <div key={entry.email} className="rounded-xl border border-border/60 p-3">
                      <p className="font-medium text-foreground">{entry.name || entry.email}</p>
                      <p className="text-sm text-muted-foreground">{entry.email}</p>
                    </div>
                  )) : <p className="text-sm text-muted-foreground">No interviewers assigned yet.</p>}
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <p className="text-sm font-medium text-foreground">Managed Admins</p>
                <div className="mt-3 space-y-3">
                  {adminUsers.length > 0 ? adminUsers.map((entry) => (
                    <div key={entry.email} className="rounded-xl border border-border/60 p-3">
                      <p className="font-medium text-foreground">{entry.name || entry.email}</p>
                      <p className="text-sm text-muted-foreground">{entry.email}</p>
                    </div>
                  )) : <p className="text-sm text-muted-foreground">No additional admins assigned from the panel.</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Admin Scope</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              'Add interviewer or additional admin accounts',
              'Monitor questions added, contests arranged, and testcase design volume',
              'Access platform analytics and management charts',
              'Open question setup and contest creation flows',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-border/70 bg-background/60 p-4 text-sm text-foreground">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.75rem',
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {activityData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={88}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {roleDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Manage Problems</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Admins can review the current problem set and permanently delete published problems.
            </p>
          </div>
          <Badge variant="outline">
            {loadingProblems ? 'Loading...' : `${apiProblems.length} problems`}
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {loadingProblems ? (
            <div className="px-6 py-10 text-sm text-muted-foreground">Loading problems...</div>
          ) : apiProblems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-secondary/30">
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Difficulty</th>
                    <th className="px-6 py-4 font-medium">Slug</th>
                    <th className="px-6 py-4 font-medium">Points</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {apiProblems.map((problem) => (
                    <tr key={problem.id} className="text-sm text-foreground">
                      <td className="px-6 py-4 align-top">
                        <div className="font-medium">{problem.title}</div>
                      </td>
                      <td className="px-6 py-4 align-top capitalize text-muted-foreground">
                        {problem.difficulty}
                      </td>
                      <td className="px-6 py-4 align-top text-muted-foreground">
                        {problem.slug}
                      </td>
                      <td className="px-6 py-4 align-top text-muted-foreground">
                        {problem.points ?? 0}
                      </td>
                      <td className="px-6 py-4 align-top text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="inline-flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDeleteProblem(problem.id, problem.title)}
                          disabled={deletingProblemId === problem.id}
                        >
                          <Trash2 className="h-4 w-4" />
                          {deletingProblemId === problem.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-10 text-sm text-muted-foreground">
              No problems are available to delete.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Registered Users</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Local accounts created in this app instance, including assigned privileges and recent account activity.
            </p>
          </div>
          <Badge variant="outline" className="inline-flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            {registeredUsers.length} accounts
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {registeredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-secondary/30">
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Created</th>
                    <th className="px-6 py-4 font-medium">Last sign in</th>
                    <th className="px-6 py-4 font-medium">Solved</th>
                    <th className="px-6 py-4 font-medium">Session</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {registeredUsers.map((entry) => (
                    <tr key={entry.id} className="text-sm text-foreground">
                      <td className="px-6 py-4 align-top">
                        <div>
                          <p className="font-medium">{entry.name}</p>
                          <p className="mt-1 text-muted-foreground">{entry.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <Badge variant={entry.role === 'admin' ? 'default' : 'outline'}>
                          {entry.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 align-top text-muted-foreground">
                        {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 align-top text-muted-foreground">
                        {entry.lastLoginAt ? new Date(entry.lastLoginAt).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="inline-flex items-center gap-2 text-muted-foreground">
                          <Target className="h-4 w-4 text-accent" />
                          {entry.problemsSolved}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="inline-flex items-center gap-2 text-muted-foreground">
                          <Clock3 className="h-4 w-4 text-accent" />
                          {entry.rememberMe ? 'Remembered' : 'Session only'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-10 text-sm text-muted-foreground">
              No local accounts have been registered yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

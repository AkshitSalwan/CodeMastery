import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import {
  Flame,
  Trophy,
  Code2,
  Briefcase,
  FileText,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  GraduationCap,
  BrainCircuit,
  Target,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { isInterviewerRole } from '../utils/roles';

const startOfDay = (value) => {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next;
};

const buildSolvedProblems = (user) =>
  Object.values(user?.learningProgress?.solvedProblems || {}).sort(
    (left, right) => new Date(right.lastSolvedAt || right.solvedAt || 0).getTime() - new Date(left.lastSolvedAt || left.solvedAt || 0).getTime()
  );

const getCurrentStreak = (solvedProblems) => {
  if (!solvedProblems.length) {
    return 0;
  }

  const uniqueDays = [...new Set(solvedProblems.map((entry) => startOfDay(entry.lastSolvedAt || entry.solvedAt).toISOString()))]
    .map((value) => new Date(value).getTime())
    .sort((left, right) => right - left);

  const today = startOfDay(new Date()).getTime();
  const yesterday = today - 24 * 60 * 60 * 1000;

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let index = 1; index < uniqueDays.length; index += 1) {
    if (uniqueDays[index - 1] - uniqueDays[index] === 24 * 60 * 60 * 1000) {
      streak += 1;
      continue;
    }

    break;
  }

  return streak;
};

const buildWeeklyProgress = (solvedProblems) => {
  const days = [];
  for (let index = 6; index >= 0; index -= 1) {
    const current = startOfDay(new Date());
    current.setDate(current.getDate() - index);
    days.push({
      key: current.toISOString().slice(0, 10),
      day: current.toLocaleDateString(undefined, { weekday: 'short' }),
      solved: 0,
    });
  }

  const counters = new Map(days.map((entry) => [entry.key, entry]));
  solvedProblems.forEach((entry) => {
    const key = startOfDay(entry.lastSolvedAt || entry.solvedAt).toISOString().slice(0, 10);
    if (counters.has(key)) {
      counters.get(key).solved += 1;
    }
  });

  return days;
};

const buildLearnerActivities = (user, solvedProblems) => {
  const assessments = Object.entries(user?.learningProgress?.assessmentHistory || {}).flatMap(
    ([topicSlug, items]) =>
      (items || []).map((item, index) => ({
        id: `${topicSlug}-${item.completedAt || index}`,
        type: 'assessment',
        title: `Finished reassessment for ${topicSlug.replace(/-/g, ' ')}`,
        description: `${item.questionIds?.length || 0} review questions completed`,
        timestamp: item.completedAt,
      }))
  );

  const solved = solvedProblems.map((entry) => ({
    id: `solved-${entry.id}-${entry.lastSolvedAt || entry.solvedAt}`,
    type: 'problem',
    title: `Solved ${entry.title}`,
    description: `${entry.difficulty} problem${entry.categories?.length ? ` in ${entry.categories.join(', ')}` : ''}`,
    timestamp: entry.lastSolvedAt || entry.solvedAt,
  }));

  return [...solved, ...assessments]
    .filter((entry) => entry.timestamp)
    .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
    .slice(0, 5);
};

const readJson = (storageKey, fallback) => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export function DashboardPage() {
  const { user } = useAuth();
  const isInterviewer = isInterviewerRole(user?.role);
  const [acceptedSubmissions, setAcceptedSubmissions] = useState([]);
  const [submissionStatsLoaded, setSubmissionStatsLoaded] = useState(false);

  const solvedProblems = useMemo(() => buildSolvedProblems(user), [user]);

  useEffect(() => {
    if (isInterviewer || !user) {
      setAcceptedSubmissions([]);
      setSubmissionStatsLoaded(false);
      return;
    }

    let cancelled = false;

    const loadAcceptedSubmissions = async () => {
      try {
        const response = await fetch('/api/problems/user/submissions?verdict=accepted&limit=500', {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(`Failed to load submissions: ${response.status}`);
        }

        const data = await response.json();
        if (!cancelled) {
          setAcceptedSubmissions(data.submissions || []);
          setSubmissionStatsLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load accepted submissions for dashboard:', error);
        if (!cancelled) {
          setAcceptedSubmissions([]);
          setSubmissionStatsLoaded(false);
        }
      }
    };

    loadAcceptedSubmissions();

    return () => {
      cancelled = true;
    };
  }, [isInterviewer, user]);

  const backendSolvedProblems = useMemo(() => {
    const solvedMap = new Map();

    acceptedSubmissions.forEach((submission) => {
      const key = String(submission.problem_id);
      const timestamp = submission.submitted_at || submission.created_at;

      if (!key || !timestamp) {
        return;
      }

      const existing = solvedMap.get(key);
      if (!existing || new Date(existing.lastSolvedAt).getTime() < new Date(timestamp).getTime()) {
        solvedMap.set(key, {
          id: submission.problem_id,
          title: submission.problem?.title || `Problem ${submission.problem_id}`,
          difficulty: submission.problem?.difficulty || 'Unknown',
          categories: [],
          solvedAt: existing?.solvedAt || timestamp,
          lastSolvedAt: timestamp,
        });
      }
    });

    return Array.from(solvedMap.values()).sort(
      (left, right) => new Date(right.lastSolvedAt || right.solvedAt || 0).getTime() - new Date(left.lastSolvedAt || left.solvedAt || 0).getTime()
    );
  }, [acceptedSubmissions]);

  const effectiveSolvedProblems = submissionStatsLoaded ? backendSolvedProblems : solvedProblems;
  const dueReviews = useMemo(
    () =>
      effectiveSolvedProblems.filter(
        (entry) => entry.nextReviewAt && new Date(entry.nextReviewAt).getTime() <= Date.now()
      ),
    [effectiveSolvedProblems]
  );
  const assessmentsCompleted = useMemo(
    () =>
      Object.values(user?.learningProgress?.assessmentHistory || {}).reduce(
        (sum, entries) => sum + (entries?.length || 0),
        0
      ),
    [user]
  );
  const weeklyProgress = useMemo(() => buildWeeklyProgress(effectiveSolvedProblems), [effectiveSolvedProblems]);
  const learnerActivities = useMemo(() => buildLearnerActivities(user, effectiveSolvedProblems), [effectiveSolvedProblems, user]);

  const customQuestions = useMemo(() => readJson('customQuestions', []), []);
  const builtTests = useMemo(() => readJson('testBuilderTests', []), []);
  const contestActivity = user?.adminSettings?.contestActivity || [];
  const interviewerActivities = contestActivity
    .map((entry) => ({
      id: entry.id,
      type: entry.type,
      title: entry.title || `Activity: ${entry.type}`,
      description: entry.description || `${entry.type} recorded in admin metrics`,
      timestamp: entry.createdAt,
    }))
    .sort((left, right) => new Date(right.timestamp || 0).getTime() - new Date(left.timestamp || 0).getTime())
    .slice(0, 5);

  const learnerStats = [
    { label: 'Problems Solved', value: effectiveSolvedProblems.length, icon: Code2, color: 'text-blue-500' },
    { label: 'Current Streak', value: getCurrentStreak(effectiveSolvedProblems), icon: Flame, color: 'text-orange-500' },
    { label: 'Reviews Due', value: dueReviews.length, icon: BrainCircuit, color: 'text-emerald-500' },
    { label: 'Assessments', value: assessmentsCompleted, icon: Trophy, color: 'text-purple-500' },
  ];

  const interviewerStats = [
    { label: 'Tests Created', value: builtTests.length, icon: Briefcase, color: 'text-blue-500' },
    { label: 'Questions Added', value: customQuestions.length, icon: FileText, color: 'text-green-500' },
    { label: 'Contests Logged', value: user?.adminSettings?.metrics?.contestsCreated || 0, icon: Calendar, color: 'text-orange-500' },
    { label: 'Testcases Designed', value: user?.adminSettings?.metrics?.testcasesDesigned || 0, icon: Target, color: 'text-purple-500' },
  ];

  const stats = isInterviewer ? interviewerStats : learnerStats;
  const activities = isInterviewer ? interviewerActivities : learnerActivities;

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
          {isInterviewer ? `Welcome back, ${user?.name || 'Interviewer'}` : `Welcome back, ${user?.name || 'Learner'}`}
        </h1>
        <p className="text-muted-foreground">
          {isInterviewer
            ? 'Track interviewer activity, contest creation, and question setup from one place.'
            : 'Pick up where you left off and keep your problem-solving momentum going.'}
        </p>
      </motion.div>

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
              whileHover={{ scale: 1.03 }}
            >
              <Card className="rounded-2xl hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-4">
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

      {!isInterviewer ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="solved" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className={`grid gap-4 ${isInterviewer ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
            {isInterviewer ? (
              <>
                <Link to="/questions/add">
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </Link>
                <Link to="/interviewer">
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Open Interviewer Panel
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
                <Link to="/learners-platform">
                  <Button variant="outline" className="w-full">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Learning Hub
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-foreground">
          {isInterviewer ? 'Recent Management Activity' : 'Recent Activity'}
        </h2>
        <Card className="rounded-2xl">
          <CardContent className="pt-6">
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    className="flex items-start gap-4 pb-4 border-b border-border last:pb-0 last:border-b-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <div className="mt-1 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      {activity.type === 'problem' || activity.type === 'questionsAdded' ? (
                        <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{activity.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'No timestamp'}
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
                {isInterviewer
                  ? 'No interviewer activity has been recorded yet.'
                  : 'No recent learner activity yet. Solve your first problem to start building momentum.'}
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

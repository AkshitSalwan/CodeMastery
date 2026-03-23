import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleLabel, isAdminRole, isInterviewerRole } from '../utils/roles';
import {
  LayoutDashboard,
  Code2,
  Flame,
  Trophy,
  Settings,
  Bookmark,
  Plus,
  MessageCircle,
  BarChart3,
  Layers,
  Zap,
  Target,
  ClipboardList,
  GraduationCap,
  Home,
} from 'lucide-react';

const publicNavItems = [
  { label: 'Home', href: '/home', icon: Home },
  { label: 'Problems', href: '/problems', icon: Code2 },
];

const userNavItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Problems', href: '/problems', icon: Code2 },
  { label: 'Topics', href: '/topics', icon: Layers },
  { label: 'Learning Hub', href: '/learners-platform', icon: GraduationCap },
  { label: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
];

const userChallengeItems = [
  { label: 'Daily Challenge', href: '/daily-challenges', icon: Flame },
  { label: 'Achievements', href: '/achievements', icon: Trophy },
  { label: 'Contests', href: '/contests', icon: Zap },
  { label: 'Leaderboard', href: '/leaderboard', icon: BarChart3 },
];

const interviewerNavItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Make a Test', href: '/make-test', icon: ClipboardList },
  { label: 'Contests', href: '/contests', icon: Target },
  { label: 'Leaderboard', href: '/leaderboard', icon: BarChart3 },
];

const adminItems = [
  { label: 'Admin Panel', href: '/admin', icon: BarChart3 },
];

const interviewerAdminItems = [
  { label: 'Add Question', href: '/questions/add', icon: Plus },
  { label: 'Admin Panel', href: '/admin', icon: BarChart3 },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role;

  const isInterviewer = isInterviewerRole(role);
  const isAdmin = isAdminRole(role);
  const mainNavItems = !user ? publicNavItems : isInterviewer ? interviewerNavItems : userNavItems;
  const showChallengeItems = !!user && !isInterviewer;
  const showAdminSection = isInterviewer || isAdmin;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background overflow-y-auto">
      <div className="p-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase px-2 mb-4">Navigation</p>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          // keep the "Topics" link active when viewing a specific topic
          const isActive =
            location.pathname === item.href ||
            (item.href === '/topics' && location.pathname.startsWith('/topics')) ||
            (item.href === '/learners-platform' && location.pathname.startsWith('/learners-platform'));
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* User-specific challenge section */}
      {showChallengeItems && (
        <div className="p-4 border-t border-border space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase px-2 mb-4">Challenges</p>
          {userChallengeItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Feedback section */}
      {user && !isInterviewer && (
        <div className="p-4 border-t border-border space-y-2">
          <Link
            to="/feedback"
            className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/feedback'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
            }`}
          >
            <MessageCircle className="h-5 w-5" />
            Feedback
          </Link>
        </div>
      )}

      {/* Admin section */}
      {user ? (
        <div className="p-4 border-t border-border space-y-4">
          {showAdminSection ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase px-2">
                {getRoleLabel(role)}
              </p>
              {(isInterviewer ? interviewerAdminItems : adminItems).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ) : null}

          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </div>
      ) : null}
    </aside>
  );
}

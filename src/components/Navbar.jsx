import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';
import { LogOut, User, Settings } from 'lucide-react';
import { useState } from 'react';
import { getRoleLabel } from '../utils/roles';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
    navigate('/sign-in');
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex shrink-0 items-center gap-3 self-stretch">
          <img
            src="/CodeMastery_brain.png"
            alt="CodeMastery_brain"
            className="h-12 w-12 object-contain"
          />
          <span className="text-2xl font-bold leading-none text-accent">CodeMastery</span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-center">
          {user && (
            <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
              {getRoleLabel(user.role)}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {!user ? (
            <>
              <Button variant="ghost" onClick={() => navigate('/sign-in')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/sign-up')}>Create Account</Button>
            </>
          ) : null}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-secondary/50"
              >
                <img
                  src={user.avatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=CodeMastery'}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-semibold text-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {getRoleLabel(user.role)}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-border">
                    <div className="text-sm font-semibold text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>

                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>

                    <div className="border-t border-border my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <ThemeToggle />
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </nav>
  );
}

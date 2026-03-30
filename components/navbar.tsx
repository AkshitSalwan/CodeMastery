import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../lib/contexts/auth-context';
import { Moon, Sun, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [dark, setDark] = useState(false);

  // Initialize theme
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const isDark = storedTheme === 'dark' || (!storedTheme && prefersDark);

    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <Link to="/dashboard" className="flex items-center gap-1">
          <img 
            src="/CodeMastery_brain.png" 
            alt="CodeMastery_brain" 
            className="h-24 w-24 object-contain"
          />
          <span className="text-2xl font-bold text-accent hidden sm:inline">CodeMastery</span>
        </Link>

        <div className="flex items-center gap-1">
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
          >
            {dark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </Button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border border-border z-50">
                
                <div className="p-4 border-b border-border">
                  <p className="font-medium text-foreground">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>

                <div className="p-2">
                  
                  <Link to="/profile" onClick={() => setShowMenu(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
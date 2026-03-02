import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold text-accent">CodeMastery</div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

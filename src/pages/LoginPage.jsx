import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState(null); // 'user' or 'interviewer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role) {
      alert('Please select a role');
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      login(role, { email, password });
      navigate('/');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Welcome to CodeMastery</CardTitle>
          <p className="text-center text-muted-foreground mt-2 text-sm">Master DSA, conquer interviews</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    role === 'user'
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <div className="font-semibold text-sm">👨‍💻 User</div>
                  <div className="text-xs text-muted-foreground">Solve problems</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('interviewer')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    role === 'interviewer'
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <div className="font-semibold text-sm">👔 Interviewer</div>
                  <div className="text-xs text-muted-foreground">Create contests</div>
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'interviewer' ? 'sarah@company.com' : 'alex@example.com'}
                className="w-full mt-2 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-2 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isSubmitting || !role}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-3 bg-muted rounded-lg">
            <p className="text-xs font-semibold text-foreground mb-2">Demo Credentials:</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>User:</strong> alex@example.com / password</p>
              <p><strong>Interviewer:</strong> sarah@interviewer.com / password</p>
            </div>
          </div>

          {/* Sign up Link */}
          <div className="mt-6 text-center">
            <span className="text-muted-foreground text-sm">Don't have an account? </span>
            <Link to="/signup" className="text-accent font-medium hover:underline text-sm">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

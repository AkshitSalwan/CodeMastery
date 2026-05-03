import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signup({ name, email, password, rememberMe });
      navigate('/dashboard');
    } catch (authError) {
      setError(authError.message || 'Unable to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/60 px-4">
      <Card className="w-full max-w-lg rounded-3xl border-border/70 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create Account</CardTitle>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Create a local CodeMastery account. Admin and interviewer privileges are applied after signup.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
            />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm password"
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
              required
            />
            <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              Keep me signed in on this device
            </label>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/sign-in" className="font-medium text-accent hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

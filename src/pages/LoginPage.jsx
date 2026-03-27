import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, requestPasswordReset, resetPasswordForDev } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedResetCode, setGeneratedResetCode] = useState('');
  const [resetExpiresAt, setResetExpiresAt] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password, rememberMe });
      navigate('/dashboard');
    } catch (authError) {
      setError(authError.message || 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateResetCode = async (event) => {
    event.preventDefault();
    setResetError('');
    setResetSuccess('');
    setIsResetting(true);

    try {
      const response = await requestPasswordReset(resetEmail);
      setGeneratedResetCode(response.resetCode);
      setResetExpiresAt(response.expiresAt);
      setResetSuccess('Dev reset code generated. Use it below to set a new password.');
    } catch (resetRequestError) {
      setResetError(resetRequestError.message || 'Unable to generate a reset code.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setResetError('');
    setResetSuccess('');
    setIsResetting(true);

    try {
      await resetPasswordForDev({
        email: resetEmail,
        resetCode,
        newPassword,
      });
      setResetCode('');
      setNewPassword('');
      setGeneratedResetCode('');
      setResetExpiresAt('');
      setResetSuccess('Password updated. You can sign in with the new password now.');
    } catch (resetActionError) {
      setResetError(resetActionError.message || 'Unable to reset password.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-secondary px-4">
      <Card className="w-full max-w-xl rounded-3xl border-border/70 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Welcome to CodeMastery</CardTitle>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in with your app account to continue.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 pr-10 text-foreground"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                Remember me on this device
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowReset((prev) => !prev);
                  setResetError('');
                  setResetSuccess('');
                }}
                className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
              >
                Forgot password?
              </button>
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {showReset ? (
            <div className="mt-6 rounded-2xl border border-border/70 bg-secondary/30 p-4">
              <p className="text-sm font-medium text-foreground">Dev password reset</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                This local-auth build simulates forgot-password without email delivery. Generate the code,
                then use the visible code to complete the reset.
              </p>

              <form onSubmit={handleGenerateResetCode} className="mt-4 space-y-3">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                  placeholder="Account email"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                  required
                />
                <Button type="submit" variant="outline" className="w-full" disabled={isResetting}>
                  {isResetting ? 'Generating...' : 'Generate reset code'}
                </Button>
              </form>

              {generatedResetCode ? (
                <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
                    Dev Reset Code
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-[0.3em] text-foreground">{generatedResetCode}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Expires {resetExpiresAt ? new Date(resetExpiresAt).toLocaleString() : 'soon'}
                  </p>
                </div>
              ) : null}

              <form onSubmit={handleResetPassword} className="mt-4 space-y-3">
                <input
                  type="text"
                  value={resetCode}
                  onChange={(event) => setResetCode(event.target.value)}
                  placeholder="Enter reset code"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                  required
                />
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="New password"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 pr-10 text-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={isResetting}>
                  {isResetting ? 'Updating...' : 'Reset password'}
                </Button>
              </form>

              {resetError ? <p className="mt-3 text-sm text-red-500">{resetError}</p> : null}
              {resetSuccess ? <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">{resetSuccess}</p> : null}
            </div>
          ) : null}

          <div className="mt-6 text-center">
            <span className="text-sm text-muted-foreground">Don&apos;t have an account? </span>
            <Link to="/sign-up" className="text-sm font-medium text-accent hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
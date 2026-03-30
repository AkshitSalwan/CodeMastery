import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { requestPasswordReset, resetPasswordForDev } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const [previewCode, setPreviewCode] = useState('');
  const [deliveryLabel, setDeliveryLabel] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');
    setPreviewCode('');
    setIsSending(true);

    try {
      const response = await requestPasswordReset(identifier);
      setInfo(response.message || 'OTP sent successfully.');
      setPreviewCode(response.delivery?.previewCode || '');
      setDeliveryLabel(response.delivery?.destination || '');
      setExpiresAt(response.expiresAt || '');
    } catch (requestError) {
      setError(requestError.message || 'Unable to send OTP.');
    } finally {
      setIsSending(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsResetting(true);

    try {
      await resetPasswordForDev({
        identifier,
        resetCode: otp,
        newPassword,
      });
      setInfo('Password updated successfully. You can sign in now.');
      setTimeout(() => navigate('/sign-in'), 1200);
    } catch (resetError) {
      setError(resetError.message || 'Unable to reset password.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-secondary px-4">
      <Card className="w-full max-w-xl rounded-3xl border-border/70 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Reset your password</CardTitle>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your email address, receive an OTP, and choose a new password.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="Email address"
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
              required
            />
            <Button type="submit" className="w-full" disabled={isSending}>
              {isSending ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>

          {deliveryLabel ? (
            <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4 text-sm text-muted-foreground">
              OTP sent to <span className="font-medium text-foreground">{deliveryLabel}</span>.
              {expiresAt ? ` It expires at ${new Date(expiresAt).toLocaleString()}.` : ''}
            </div>
          ) : null}

          {previewCode ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
                Development OTP
              </p>
              <p className="mt-2 text-2xl font-bold tracking-[0.3em] text-foreground">{previewCode}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Email delivery is not configured yet, so the OTP is shown here for local development.
              </p>
            </div>
          ) : null}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="Enter OTP"
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="New password"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 pr-10 text-foreground"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
              required
            />
            <Button type="submit" className="w-full" disabled={isResetting}>
              {isResetting ? 'Resetting password...' : 'Reset Password'}
            </Button>
          </form>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          {info ? <p className="text-sm text-emerald-600 dark:text-emerald-400">{info}</p> : null}

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Remembered your password? </span>
            <Link to="/sign-in" className="font-medium text-accent hover:underline">
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

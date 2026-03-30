import React, { useMemo, useState } from 'react';
import { CheckCircle2, KeyRound, Mail, MonitorSmartphone, ShieldCheck, UserCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';

const getDisplayDate = (value) => {
  if (!value) {
    return 'Not available yet';
  }

  return new Date(value).toLocaleString();
};

export function SettingsPage() {
  const {
    user,
    updateUser,
    changePassword,
    sessionInfo,
  } = useAuth();
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    organization: user?.organization || '',
    availability: user?.availability || '',
    company: user?.company || '',
    location: user?.location || '',
    title: user?.title || '',
  });
  const [emailNotifications, setEmailNotifications] = useState(user?.preferences?.emailNotifications ?? true);
  const [selectedTheme, setSelectedTheme] = useState(user?.preferences?.theme || theme);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        organization: user.organization || '',
        availability: user.availability || '',
        company: user.company || '',
        location: user.location || '',
        title: user.title || '',
      });
      setEmailNotifications(user.preferences?.emailNotifications ?? true);
      setSelectedTheme(user.preferences?.theme || theme);
    }
  }, [user, theme]);

  const accountHighlights = useMemo(
    () => [
      {
        label: 'Role',
        value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Learner',
        icon: ShieldCheck,
      },
      {
        label: 'Session',
        value: sessionInfo?.isPersistent ? 'Remembered on this device' : 'This browser session only',
        icon: MonitorSmartphone,
      },
      {
        label: 'Password changed',
        value: getDisplayDate(user?.security?.lastPasswordChangedAt),
        icon: KeyRound,
      },
      {
        label: 'Last sign in',
        value: getDisplayDate(user?.security?.lastLoginAt),
        icon: Mail,
      },
    ],
    [sessionInfo?.isPersistent, user?.role, user?.security?.lastLoginAt, user?.security?.lastPasswordChangedAt]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    setError('');
    updateUser(formData);
    setMessage('Profile updated successfully.');
    window.setTimeout(() => setMessage(''), 2500);
  };

  const handleSavePreferences = (event) => {
    event.preventDefault();
    setError('');
    updateUser({ preferences: { emailNotifications, theme: selectedTheme } });
    setTheme(selectedTheme);
    setMessage('Preferences saved.');
    window.setTimeout(() => setMessage(''), 2500);
  };

  const handlePasswordFieldChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setIsSavingPassword(true);

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordMessage('Password changed successfully.');
    } catch (changeError) {
      setPasswordError(changeError.message || 'Unable to update password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-background via-card to-accent/10 shadow-sm">
        <div className="grid gap-6 px-6 py-8 sm:px-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm text-muted-foreground">
              <UserCircle2 className="h-4 w-4 text-accent" />
              Account Settings
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Personalize your workspace</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                Manage your profile, session preferences, and account security from one place.
              </p>
            </div>
            {message ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                {message}
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {accountHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label} className="rounded-2xl border-border/70 bg-card/85 shadow-none">
                  <CardContent className="space-y-3 p-5">
                    <div className="inline-flex rounded-xl bg-accent/10 p-2 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-foreground">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleSaveProfile}>
          <Card className="rounded-[1.5rem]">
            <CardHeader>
              <CardTitle>Profile details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    disabled
                    className="mt-2 block w-full cursor-not-allowed rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="mt-2 block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-accent"
                  placeholder="Share what you are focused on right now."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground">Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-accent"
                    placeholder="e.g. Frontend Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Company</label>
                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-accent"
                    placeholder="e.g. CodeMastery Labs"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground">Location</label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-accent"
                    placeholder="e.g. Delhi, India"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Availability</label>
                  <input
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-accent"
                    placeholder="e.g. Weekdays 7pm-10pm"
                  />
                </div>
              </div>

              {user?.role !== 'learner' ? (
                <div>
                  <label className="block text-sm font-medium text-foreground">Organization</label>
                  <input
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-accent"
                    placeholder="e.g. Hiring team or academy name"
                  />
                </div>
              ) : null}

              {error ? <p className="text-sm text-red-500">{error}</p> : null}

              <div className="flex flex-wrap gap-3">
                <Button type="submit">Save profile</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      bio: user?.bio || '',
                      organization: user?.organization || '',
                      availability: user?.availability || '',
                      company: user?.company || '',
                      location: user?.location || '',
                      title: user?.title || '',
                    })
                  }
                >
                  Reset edits
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        <div className="space-y-6">
          <form onSubmit={handleSavePreferences}>
            <Card className="rounded-[1.5rem]">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <label className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/60 p-4">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(event) => setEmailNotifications(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border"
                  />
                  <div>
                    <p className="font-medium text-foreground">Email notifications</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Keep reminder and account updates enabled for this local profile.
                    </p>
                  </div>
                </label>

                <div>
                  <label className="block text-sm font-medium text-foreground">Theme</label>
                  <select
                    value={selectedTheme}
                    onChange={(event) => setSelectedTheme(event.target.value)}
                    className="mt-2 block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-accent"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <Button type="submit">Save preferences</Button>
              </CardContent>
            </Card>
          </form>

          <form onSubmit={handleChangePassword}>
            <Card className="rounded-[1.5rem]">
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground">Current password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordFieldChange}
                      className="mt-2 block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">New password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordFieldChange}
                      className="mt-2 block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Confirm new password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordFieldChange}
                      className="mt-2 block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-accent"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4 text-sm text-muted-foreground">
                  Forgot-password is available from the sign-in screen. It now uses OTP delivery to email
                  when Resend is configured, and shows a temporary development OTP locally otherwise.
                </div>

                {passwordError ? <p className="text-sm text-red-500">{passwordError}</p> : null}
                {passwordMessage ? <p className="text-sm text-emerald-600 dark:text-emerald-400">{passwordMessage}</p> : null}

                <Button type="submit" disabled={isSavingPassword}>
                  {isSavingPassword ? 'Updating password...' : 'Change password'}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}

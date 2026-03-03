import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';

export function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    organization: user?.organization || '',
    availability: user?.availability || '',
  });

  // whenever user object updates (after save), keep form in sync
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        organization: user.organization || '',
        availability: user.availability || '',
      });
    }
  }, [user]);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(user?.preferences?.emailNotifications ?? true);
  const [selectedTheme, setSelectedTheme] = useState(user?.preferences?.theme || theme);

  React.useEffect(() => {
    if (user) {
      setEmailNotifications(user.preferences?.emailNotifications ?? true);
      setSelectedTheme(user.preferences?.theme || theme);
    }
  }, [user, theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser(formData);
    setMessage('Profile saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // mock: simply clear field and show message
    setPassword('');
    setMessage('Password updated');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    updateUser({ preferences: { emailNotifications, theme: selectedTheme } });
    setTheme(selectedTheme);
    setMessage('Preferences saved');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and application settings</p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>

            {user?.role === 'interviewer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground">Organization</label>
                  <input
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Default Availability</label>
                  <input
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    placeholder="e.g. Weekdays 9am-5pm"
                    className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-primary focus:border-primary"
                  />
                </div>
              </>
            )}

            <div className="pt-4">
              <Button type="submit">Save changes</Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">New Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="pt-4">
              <Button type="submit">Update password</Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Preferences */}
      <form onSubmit={handleSavePreferences} className="space-y-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="emailNotifications" className="text-sm text-foreground">
                Email notifications
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Theme</label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-primary focus:border-primary"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="pt-4">
              <Button type="submit">Save preferences</Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {message && (
        <div className="text-sm text-primary font-medium">{message}</div>
      )}
    </div>
  );
}

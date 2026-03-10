import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/react';

const AuthContext = createContext(null);

const DEFAULT_PROFILE = {
  role: 'user',
  totalPoints: 2450,
  streak: 12,
  problemsSolved: 85,
  bio: 'Data structures and algorithms enthusiast',
  preferences: {
    emailNotifications: true,
    theme: 'light',
  },
  bookmarkedProblems: ['1', '5', '8'],
};

export function AuthProvider({ children }) {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerkAuth();

  const [profile, setProfile] = useState(null);

  // Load and persist app-specific profile data (role, bookmarks, etc.) per Clerk user
  useEffect(() => {
    if (!isLoaded) return;

    if (!clerkUser) {
      setProfile(null);
      return;
    }

    const storageKey = `cm-profile-${clerkUser.id}`;
    let stored = null;
    try {
      const raw = localStorage.getItem(storageKey);
      stored = raw ? JSON.parse(raw) : null;
    } catch {
      stored = null;
    }

    const base = {
      ...DEFAULT_PROFILE,
      ...(stored || {}),
      id: clerkUser.id,
      name:
        clerkUser.fullName ||
        clerkUser.firstName ||
        clerkUser.username ||
        clerkUser.primaryEmailAddress?.emailAddress ||
        'User',
      email:
        clerkUser.primaryEmailAddress?.emailAddress ||
        stored?.email ||
        '',
      avatar: clerkUser.imageUrl || stored?.avatar || DEFAULT_PROFILE.avatar,
      createdAt: stored?.createdAt || new Date().toISOString(),
    };

    setProfile(base);

    try {
      localStorage.setItem(storageKey, JSON.stringify(base));
    } catch {}
  }, [clerkUser, isLoaded]);

  const updateUser = (updates) => {
    setProfile((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      const storageKey = `cm-profile-${prev.id}`;
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleBookmark = (problemId) => {
    setProfile((prev) => {
      if (!prev) return prev;
      const exists = prev.bookmarkedProblems?.includes(problemId);
      const next = {
        ...prev,
        bookmarkedProblems: exists
          ? prev.bookmarkedProblems.filter((id) => id !== problemId)
          : [...(prev.bookmarkedProblems || []), problemId],
      };
      const storageKey = `cm-profile-${prev.id}`;
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const isBookmarked = (problemId) => {
    return profile?.bookmarkedProblems?.includes(problemId) || false;
  };

  const logout = async () => {
    try {
      await signOut();
    } finally {
      setProfile(null);
    }
  };

  // `login` is now handled by Clerk's SignIn component; keep a no-op for backwards compatibility
  const login = () => {
    console.warn('Login is handled by Clerk. Use the /login page.');
  };

  const value = useMemo(
    () => ({
      user: profile,
      isAuthenticated: !!profile && isSignedIn,
      isLoading: !isLoaded,
      login,
      logout,
      toggleBookmark,
      isBookmarked,
      updateUser,
    }),
    [profile, isSignedIn, isLoaded]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

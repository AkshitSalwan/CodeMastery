import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/react';
import { normalizeRole } from '../utils/roles';

const AuthContext = createContext(null);

const DEFAULT_PROFILE = {
  role: 'learner',
  totalPoints: 2450,
  streak: 12,
  problemsSolved: 85,
  bio: 'Data structures and algorithms enthusiast',
  avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=CodeMastery',
  preferences: {
    emailNotifications: true,
    theme: 'light',
  },
  bookmarkedProblems: ['1', '5', '8'],
  learningProgress: {
    solvedProblems: {},
    assessmentHistory: {},
  },
};

const REVIEW_INTERVALS_DAYS = [3, 7, 14, 30];

const getNextReviewAt = (reviewCount = 0, fromDate = new Date()) => {
  const nextDate = new Date(fromDate);
  const days = REVIEW_INTERVALS_DAYS[Math.min(reviewCount, REVIEW_INTERVALS_DAYS.length - 1)];
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString();
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
      role: normalizeRole(stored?.role || clerkUser.publicMetadata?.role || DEFAULT_PROFILE.role),
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
      const next = {
        ...prev,
        ...updates,
        role: normalizeRole(updates?.role || prev.role),
        preferences: {
          ...(prev.preferences || {}),
          ...(updates?.preferences || {}),
        },
        learningProgress: {
          ...(prev.learningProgress || DEFAULT_PROFILE.learningProgress),
          ...(updates?.learningProgress || {}),
          solvedProblems: {
            ...(prev.learningProgress?.solvedProblems || {}),
            ...(updates?.learningProgress?.solvedProblems || {}),
          },
          assessmentHistory: {
            ...(prev.learningProgress?.assessmentHistory || {}),
            ...(updates?.learningProgress?.assessmentHistory || {}),
          },
        },
      };
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

  const markProblemSolved = (problem) => {
    setProfile((prev) => {
      if (!prev || !problem?.id) return prev;

      const existingEntry = prev.learningProgress?.solvedProblems?.[problem.id];
      const reviewCount = existingEntry?.reviewCount || 0;
      const solvedAt = existingEntry?.solvedAt || new Date().toISOString();
      const next = {
        ...prev,
        problemsSolved: Math.max(prev.problemsSolved || 0, Object.keys(prev.learningProgress?.solvedProblems || {}).length + (existingEntry ? 0 : 1)),
        learningProgress: {
          ...(prev.learningProgress || DEFAULT_PROFILE.learningProgress),
          solvedProblems: {
            ...(prev.learningProgress?.solvedProblems || {}),
            [problem.id]: {
              id: problem.id,
              title: problem.title,
              difficulty: problem.difficulty,
              categories: problem.category || [],
              solvedAt,
              lastSolvedAt: new Date().toISOString(),
              lastReviewedAt: existingEntry?.lastReviewedAt || null,
              nextReviewAt: getNextReviewAt(reviewCount, new Date()),
              reviewCount,
              successfulSubmissions: (existingEntry?.successfulSubmissions || 0) + 1,
            },
          },
          assessmentHistory: {
            ...(prev.learningProgress?.assessmentHistory || {}),
          },
        },
      };

      const storageKey = `cm-profile-${prev.id}`;
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}

      return next;
    });
  };

  const saveAssessmentResult = ({ topicSlug, questionIds = [] }) => {
    setProfile((prev) => {
      if (!prev || !topicSlug) return prev;

      const currentHistory = prev.learningProgress?.assessmentHistory?.[topicSlug] || [];
      const solvedProblems = { ...(prev.learningProgress?.solvedProblems || {}) };
      const now = new Date();

      questionIds.forEach((problemId) => {
        const existingEntry = solvedProblems[problemId];
        if (!existingEntry) return;

        const nextReviewCount = (existingEntry.reviewCount || 0) + 1;
        solvedProblems[problemId] = {
          ...existingEntry,
          reviewCount: nextReviewCount,
          lastReviewedAt: now.toISOString(),
          nextReviewAt: getNextReviewAt(nextReviewCount, now),
        };
      });

      const next = {
        ...prev,
        learningProgress: {
          ...(prev.learningProgress || DEFAULT_PROFILE.learningProgress),
          solvedProblems,
          assessmentHistory: {
            ...(prev.learningProgress?.assessmentHistory || {}),
            [topicSlug]: [
              {
                completedAt: now.toISOString(),
                questionIds,
              },
              ...currentHistory,
            ].slice(0, 10),
          },
        },
      };

      const storageKey = `cm-profile-${prev.id}`;
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}

      return next;
    });
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
    console.warn('Login is handled by Clerk. Use the /sign-in page.');
  };

  const value = useMemo(
    () => ({
      user: profile,
      isAuthenticated: !!profile && isSignedIn,
      isLoading: !isLoaded || (isSignedIn && !profile),
      login,
      logout,
      toggleBookmark,
      isBookmarked,
      updateUser,
      markProblemSolved,
      saveAssessmentResult,
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

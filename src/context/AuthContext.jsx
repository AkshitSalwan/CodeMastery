import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const MOCK_USER = {
  id: 'user-1',
  name: 'Alex Developer',
  email: 'alex@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  bio: 'Data structures and algorithms enthusiast',
  createdAt: new Date('2024-01-01'),
  bookmarkedProblems: ['1', '5', '8'],
  role: 'user',
  totalPoints: 2450,
  streak: 12,
  problemsSolved: 85,
  preferences: {
    emailNotifications: true,
    theme: 'light',
  },
};

const MOCK_INTERVIEWER = {
  id: 'interviewer-1',
  name: 'Sarah Chen',
  email: 'sarah@interviewer.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  bio: 'Senior Technical Interviewer',
  createdAt: new Date('2024-02-01'),
  role: 'interviewer',
  organization: 'Tech Corp',
  totalCandidatesInterviewed: 42,
  contestsCreated: 8,
  preferences: {
    emailNotifications: true,
    theme: 'light',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!user);

  const login = (role, credentials) => {
    let u = null;
    if (role === 'user') {
      u = MOCK_USER;
    } else if (role === 'interviewer') {
      u = MOCK_INTERVIEWER;
    }
    if (u) {
      setUser(u);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(u));
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  // update user profile data (mock implementation)
  const updateUser = (updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('currentUser', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleBookmark = (problemId) => {
    if (user?.role === 'user') {
      setUser(prev => ({
        ...prev,
        bookmarkedProblems: prev.bookmarkedProblems.includes(problemId)
          ? prev.bookmarkedProblems.filter(id => id !== problemId)
          : [...prev.bookmarkedProblems, problemId],
      }));
    }
  };

  const isBookmarked = (problemId) => {
    return user?.bookmarkedProblems?.includes(problemId) || false;
  };

  // keep localStorage in sync when user changes (in case other logic updates it)
  React.useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } catch {}
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, toggleBookmark, isBookmarked, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

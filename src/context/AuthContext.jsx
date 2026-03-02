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
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER);

  const toggleBookmark = (problemId) => {
    setUser(prev => ({
      ...prev,
      bookmarkedProblems: prev.bookmarkedProblems.includes(problemId)
        ? prev.bookmarkedProblems.filter(id => id !== problemId)
        : [...prev.bookmarkedProblems, problemId],
    }));
  };

  const isBookmarked = (problemId) => {
    return user.bookmarkedProblems.includes(problemId);
  };

  return (
    <AuthContext.Provider value={{ user, toggleBookmark, isBookmarked }}>
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

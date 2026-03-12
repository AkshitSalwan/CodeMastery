'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../../lib/types/user';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  toggleBookmark: (problemId: string) => void;
  isBookmarked: (problemId: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: 'user-1',
  name: 'Alex Developer',
  email: 'alex@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  bio: 'Data structures and algorithms enthusiast',
  createdAt: new Date('2024-01-01'),
  bookmarkedProblems: ['1', '5', '8'],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
        // Auto-login with mock user for demo
        setUser(MOCK_USER);
        localStorage.setItem('user', JSON.stringify(MOCK_USER));
      }
    } else {
      // Auto-login with mock user for demo (first time or if localStorage cleared)
      setUser(MOCK_USER);
      localStorage.setItem('user', JSON.stringify(MOCK_USER));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in reality this would call an API
    if (email && password.length >= 6) {
      const user = { ...MOCK_USER, email };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    // Mock signup - in reality this would call an API
    if (name && email && password.length >= 6) {
      const newUser: User = {
        ...MOCK_USER,
        id: `user-${Date.now()}`,
        name,
        email,
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      throw new Error('Invalid signup data');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const toggleBookmark = (problemId: string) => {
    if (!user) return;
    const updated = {
      ...user,
      bookmarkedProblems: user.bookmarkedProblems.includes(problemId)
        ? user.bookmarkedProblems.filter(id => id !== problemId)
        : [...user.bookmarkedProblems, problemId],
    };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const isBookmarked = (problemId: string) => {
    return user?.bookmarkedProblems.includes(problemId) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        toggleBookmark,
        isBookmarked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  bookmarkedProblems: string[];
};

export type UserStats = {
  userId: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  streak: number;
  maxStreak: number;
  level: number;
  xp: number;
  lastSolvedDate?: Date;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
};

export type Feedback = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  message: string;
  type: 'bug' | 'feature' | 'general';
  createdAt: Date;
};

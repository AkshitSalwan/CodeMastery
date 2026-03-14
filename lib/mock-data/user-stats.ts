import type { UserStats, Achievement } from '../..//lib/types/user';

export const mockUserStats: UserStats = {
  userId: 'user-1',
  totalSolved: 127,
  easySolved: 58,
  mediumSolved: 52,
  hardSolved: 17,
  streak: 12,
  maxStreak: 25,
  level: 8,
  xp: 3850,
  lastSolvedDate: new Date(Date.now() - 1 *24 * 60 * 60 * 1000), // Yesterday
};

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    name: 'First Blood',
    description: 'Solve your first problem',
    icon: '🩸',
    unlockedAt: new Date('2024-01-15'),
  },
  {
    id: 'ach-2',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚔️',
    unlockedAt: new Date('2024-02-10'),
  },
  {
    id: 'ach-3',
    name: 'Century Club',
    description: 'Solve 100 problems',
    icon: '💯',
    unlockedAt: new Date('2024-02-18'),
  },
  {
    id: 'ach-4',
    name: 'Easy Street',
    description: 'Solve 50 easy problems',
    icon: '✨',
    unlockedAt: new Date('2024-01-20'),
  },
  {
    id: 'ach-5',
    name: 'Medium Rare',
    description: 'Solve 25 medium problems',
    icon: '🔥',
  },
  {
    id: 'ach-6',
    name: 'Hard Mode',
    description: 'Solve 10 hard problems',
    icon: '💎',
  },
];

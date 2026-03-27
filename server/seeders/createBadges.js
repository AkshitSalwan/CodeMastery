import { Badge } from '../models/index.js';

export const createBadges = async () => {
  try {
    const badges = [
      {
        name: 'First Step',
        slug: 'first-step',
        description: 'Solve your first problem',
        icon: '🎯',
        color: '#3b82f6',
        category: 'problem_solving',
        criteria: { type: 'problems_solved', count: 1 },
        points: 10,
        rarity: 'common',
        is_active: true,
      },
      {
        name: 'Problem Solver',
        slug: 'problem-solver',
        description: 'Solve 10 problems',
        icon: '⚡',
        color: '#f59e0b',
        category: 'problem_solving',
        criteria: { type: 'problems_solved', count: 10 },
        points: 50,
        rarity: 'uncommon',
        is_active: true,
      },
      {
        name: 'Expert Problem Solver',
        slug: 'expert-problem-solver',
        description: 'Solve 50 problems',
        icon: '🏆',
        color: '#8b5cf6',
        category: 'problem_solving',
        criteria: { type: 'problems_solved', count: 50 },
        points: 100,
        rarity: 'rare',
        is_active: true,
      },
      {
        name: 'Week Warrior',
        slug: 'week-warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        color: '#ef4444',
        category: 'streak',
        criteria: { type: 'streak', days: 7 },
        points: 75,
        rarity: 'rare',
        is_active: true,
      },
      {
        name: 'Speed Demon',
        slug: 'speed-demon',
        description: 'Solve 5 problems in one day',
        icon: '⚙️',
        color: '#06b6d4',
        category: 'problem_solving',
        criteria: { type: 'problems_in_day', count: 5 },
        points: 60,
        rarity: 'uncommon',
        is_active: true,
      },
      {
        name: 'Algorithm Master',
        slug: 'algorithm-master',
        description: 'Solve 20 algorithm problems',
        icon: '🧠',
        color: '#06b6d4',
        category: 'problem_solving',
        criteria: { type: 'algorithm_problems', count: 20 },
        points: 200,
        rarity: 'epic',
        is_active: true,
      },
      {
        name: 'Perfect Score',
        slug: 'perfect-score',
        description: 'Pass all test cases without error',
        icon: '✨',
        color: '#ec4899',
        category: 'problem_solving',
        criteria: { type: 'perfect_submissions', count: 1 },
        points: 45,
        rarity: 'uncommon',
        is_active: true,
      },
      {
        name: 'Data Structure Pro',
        slug: 'data-structure-pro',
        description: 'Solve 15 data structure problems',
        icon: '🏗️',
        color: '#10b981',
        category: 'learning',
        criteria: { type: 'ds_problems', count: 15 },
        points: 150,
        rarity: 'rare',
        is_active: true,
      },
    ];

    for (const badgeData of badges) {
      try {
        // Check if badge already exists
        const badgeExists = await Badge.findOne({
          where: { slug: badgeData.slug }
        });

        if (badgeExists) {
          console.log(`✓ Badge already exists: ${badgeData.name}`);
          continue;
        }

        // Create badge
        const badge = await Badge.create(badgeData);
        console.log(`✓ Badge created: ${badge.name}`);
      } catch (error) {
        console.error(`✗ Failed to create badge ${badgeData.name}:`, error.message);
      }
    }

    console.log('✓ Badge seeding completed');
  } catch (error) {
    console.error('✗ Badge seeding failed:', error);
  }
};

export default createBadges;

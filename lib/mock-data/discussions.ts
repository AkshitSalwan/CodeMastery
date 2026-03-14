import type { DiscussionThread } from '../../lib/types/discussion';
import type { User } from '../../lib/types/user';

const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Developer',
    email: 'alex@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    createdAt: new Date('2024-01-01'),
    bookmarkedProblems: [],
  },
  {
    id: 'user-2',
    name: 'Jane Coder',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    createdAt: new Date('2024-02-01'),
    bookmarkedProblems: [],
  },
  {
    id: 'user-3',
    name: 'Bob Engineer',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    createdAt: new Date('2024-01-15'),
    bookmarkedProblems: [],
  },
];

export const mockDiscussions: Record<string, DiscussionThread[]> = {
  '1': [
    {
      id: 'thread-1',
      problemId: '1',
      title: 'Hash Map Solution Explanation',
      author: mockUsers[1],
      content:
        'I used a hash map to store complements as I iterate. This allows O(1) lookup. Here is my approach...',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      upvotes: 24,
      isUserUpvoted: false,
      comments: [
        {
          id: 'comment-1',
          threadId: 'thread-1',
          author: mockUsers[0],
          content: 'Great explanation! This really helped me understand the approach.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          upvotes: 5,
        },
        {
          id: 'comment-2',
          threadId: 'thread-1',
          author: mockUsers[2],
          content: 'Can you explain why space complexity is O(n)?',
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          upvotes: 3,
        },
      ],
    },
    {
      id: 'thread-2',
      problemId: '1',
      title: 'Brute Force vs Optimized Solution',
      author: mockUsers[2],
      content:
        'Should beginners start with brute force before moving to optimized solutions? I think it helps with understanding...',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      upvotes: 12,
      isUserUpvoted: true,
      comments: [],
    },
  ],
  '2': [
    {
      id: 'thread-3',
      problemId: '2',
      title: 'Handling Carry Over',
      author: mockUsers[0],
      content:
        'I had trouble with the carry over logic. The key is to check if carry exists before processing next nodes.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      upvotes: 8,
      isUserUpvoted: false,
      comments: [
        {
          id: 'comment-3',
          threadId: 'thread-3',
          author: mockUsers[1],
          content: 'This is exactly what I was missing! Thank you.',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          upvotes: 2,
        },
      ],
    },
  ],
};
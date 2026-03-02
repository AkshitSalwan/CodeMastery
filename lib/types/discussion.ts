import type { User } from './user';

export type DiscussionThread = {
  id: string;
  problemId: string;
  title: string;
  author: User;
  content: string;
  createdAt: Date;
  upvotes: number;
  isUserUpvoted?: boolean;
  comments: Comment[];
};

export type Comment = {
  id: string;
  threadId: string;
  author: User;
  content: string;
  createdAt: Date;
  upvotes: number;
  isUserUpvoted?: boolean;
};

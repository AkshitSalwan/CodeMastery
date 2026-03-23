import { Server } from 'socket.io';
import { ContestParticipant, ContestSubmission, Submission, User } from '../models/index.js';
import { cacheService } from '../config/redis.js';

let io = null;

export const initializeSocket = (server, corsOrigin) => {
  io = new Server(server, {
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware for socket
  io.use(async (socket, next) => {
    try {
      // You can add authentication here if needed
      // For now, we'll allow all connections
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join contest room
    socket.on('contest:join', async (data) => {
      const { contestId, userId } = data;
      socket.join(`contest:${contestId}`);
      
      // Send current leaderboard
      const leaderboard = await getContestLeaderboard(contestId);
      socket.emit('contest:leaderboard:init', { leaderboard });
      
      console.log(`User ${userId} joined contest ${contestId}`);
    });

    // Leave contest room
    socket.on('contest:leave', (data) => {
      const { contestId, userId } = data;
      socket.leave(`contest:${contestId}`);
      console.log(`User ${userId} left contest ${contestId}`);
    });

    // Join discussion room
    socket.on('discussion:join', (data) => {
      const { discussionId } = data;
      socket.join(`discussion:${discussionId}`);
    });

    socket.on('discussion:leave', (data) => {
      const { discussionId } = data;
      socket.leave(`discussion:${discussionId}`);
    });

    // Join topic room
    socket.on('topic:join', (data) => {
      const { topicId } = data;
      socket.join(`topic:${topicId}`);
    });

    socket.on('topic:leave', (data) => {
      const { topicId } = data;
      socket.leave(`topic:${topicId}`);
    });

    // Join problem room
    socket.on('problem:join', (data) => {
      const { problemId } = data;
      socket.join(`problem:${problemId}`);
    });

    socket.on('problem:leave', (data) => {
      const { problemId } = data;
      socket.leave(`problem:${problemId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Get contest leaderboard
async function getContestLeaderboard(contestId) {
  const cacheKey = `contest:${contestId}:leaderboard`;
  
  // Try cache first
  let leaderboardData = await cacheService.getLeaderboard(cacheKey, 0, 49);
  
  if (!leaderboardData || leaderboardData.length === 0) {
    // Get from database
    const participants = await ContestParticipant.findAll({
      where: { contest_id: contestId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [
        ['score', 'DESC'],
        ['total_time', 'ASC']
      ],
      limit: 50
    });
    
    leaderboardData = participants.map((p, index) => ({
      rank: index + 1,
      userId: p.user_id,
      username: p.user?.username,
      avatar: p.user?.avatar,
      score: p.score,
      problemsSolved: p.problems_solved,
      totalTime: p.total_time
    }));
  }
  
  return leaderboardData;
}

// Emit to contest room
export const emitToContest = (contestId, event, data) => {
  if (io) {
    io.to(`contest:${contestId}`).emit(event, data);
  }
};

// Emit to discussion room
export const emitToDiscussion = (discussionId, event, data) => {
  if (io) {
    io.to(`discussion:${discussionId}`).emit(event, data);
  }
};

// Get socket.io instance
export const getSocketIO = () => io;

export default {
  initializeSocket,
  emitToContest,
  emitToDiscussion,
  getSocketIO
};

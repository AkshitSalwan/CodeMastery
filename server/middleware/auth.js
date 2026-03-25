import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Required authentication middleware
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Get or create user (load user data)
const getOrCreateUser = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update last login
    await user.update({ last_login: new Date() });
    req.dbUser = user;
    next();
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Failed to load user' });
  }
};

// Optional auth - doesn't require authentication
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      if (decoded) {
        const user = await User.findByPk(decoded.userId);
        if (user) {
          req.userId = decoded.userId;
          req.dbUser = user;
        }
      }
    }
    next();
  } catch (error) {
    next(); // Continue even if auth fails for optional routes
  }
};

// Admin only middleware
const adminOnly = async (req, res, next) => {
  try {
    if (!req.dbUser || req.dbUser.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Access denied' });
  }
};

// Interviewer or Admin middleware
const interviewerOrAdmin = async (req, res, next) => {
  try {
    if (!req.dbUser || (req.dbUser.role !== 'admin' && req.dbUser.role !== 'interviewer')) {
      return res.status(403).json({ error: 'Interviewer or admin access required' });
    }
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Access denied' });
  }
};

export {
  verifyToken,
  generateToken,
  requireAuth,
  getOrCreateUser,
  optionalAuth,
  adminOnly,
  interviewerOrAdmin
};

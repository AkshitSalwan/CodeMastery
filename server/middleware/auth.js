import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { User } from '../models/index.js';

// Clerk authentication middleware
export const requireAuth = ClerkExpressRequireAuth({
  secretKey: process.env.CLERK_SECRET_KEY
});

// Get or create user from Clerk
export const getOrCreateUser = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const clerkUserId = req.auth.userId;
    
    // Find user by Clerk ID
    let user = await User.findOne({ where: { clerk_id: clerkUserId } });
    
    if (!user) {
      // Get user data from Clerk
      const clerkUser = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`
        }
      });

      if (!clerkUser.ok) {
        return res.status(500).json({ error: 'Failed to fetch user from Clerk' });
      }

      const userData = await clerkUser.json();
      const email = userData.email_addresses?.[0]?.email_address || '';
      const username = userData.username || email.split('@')[0];
      
      // Create new user
      user = await User.create({
        clerk_id: clerkUserId,
        email: email,
        username: username,
        avatar: userData.image_url,
        role: 'learner',
        last_login: new Date()
      });
    } else {
      // Update last login
      await user.update({ last_login: new Date() });
    }

    req.dbUser = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication error' });
  }
};

// Optional auth - doesn't require authentication but populates user if available
export const optionalAuth = async (req, res, next) => {
  try {
    if (req.auth && req.auth.userId) {
      const user = await User.findOne({ where: { clerk_id: req.auth.userId } });
      req.dbUser = user;
    }
    next();
  } catch (error) {
    next();
  }
};

export default {
  requireAuth,
  getOrCreateUser,
  optionalAuth
};

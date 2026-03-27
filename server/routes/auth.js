import express from 'express';
import { User } from '../models/index.js';
import { generateToken, requireAuth, getOrCreateUser } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      where: { 
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // Create user
    const user = await User.create({
      email,
      username,
      role: 'learner'
    });

    // Set password
    await user.setPassword(password);
    await user.save();

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Validate password
    const isValid = await user.validatePassword(password);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', requireAuth, getOrCreateUser, (req, res) => {
  try {
    res.json({
      user: req.dbUser.toJSON()
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Logout (client-side: delete token)
router.post('/logout', requireAuth, (req, res) => {
  try {
    res.json({
      message: 'Logout successful. Please delete the token from client.'
    });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;

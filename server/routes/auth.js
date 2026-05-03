import express from 'express';
import { User } from '../models/index.js';
import { generateToken, requireAuth, getOrCreateUser } from '../middleware/auth.js';
import { Op, UniqueConstraintError, ValidationError as SequelizeValidationError } from 'sequelize';
import { clearOtp, generateOtp, isOtpExpired, readOtp, sendOtp, storeOtp } from '../services/passwordResetService.js';
import { cacheService } from '../config/redis.js';

const router = express.Router();

const isEmailIdentifier = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

// Rate limiting middleware for login attempts
const loginRateLimit = async (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const key = `login_attempts:${clientIP}`;
  
  try {
    const attempts = await cacheService.get(key) || 0;
    
    if (attempts >= 5) {
      return res.status(429).json({ 
        error: 'Too many login attempts. Please try again later.' 
      });
    }
    
    // Increment attempts
    await cacheService.set(key, attempts + 1, 900); // 15 minutes expiry
    next();
  } catch (error) {
    // If Redis fails, allow the request
    console.warn('Rate limiting check failed:', error.message);
    next();
  }
};

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedUsername = String(username || '').trim();

    // Validation
    if (!normalizedEmail || !normalizedUsername || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      where: { 
        [Op.or]: [
          { email: normalizedEmail },
          { username: normalizedUsername },
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // Build first so password_hash can be set before validation/insert.
    const user = User.build({
      email: normalizedEmail,
      username: normalizedUsername,
      role: 'learner'
    });

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
    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }
    if (error instanceof SequelizeValidationError) {
      const firstMessage = error.errors?.[0]?.message;
      return res.status(400).json({ error: firstMessage || 'Invalid registration data' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login route
router.post('/login', loginRateLimit, async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

    // Validation
    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Validate password
    const isValid = await user.validatePassword(password);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Reset login attempts on successful login
    try {
      await cacheService.del(`login_attempts:${clientIP}`);
    } catch (error) {
      console.warn('Failed to reset login attempts:', error.message);
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Cache user data for faster subsequent requests
    try {
      await cacheService.set(`user:${user.id}`, user.toJSON(), 3600); // Cache for 1 hour
    } catch (error) {
      console.warn('Failed to cache user data:', error.message);
    }

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

router.post('/forgot-password/request-otp', async (req, res) => {
  try {
    const { identifier } = req.body || {};
    const normalizedIdentifier = String(identifier || '').trim().toLowerCase();

    if (!normalizedIdentifier || !isEmailIdentifier(normalizedIdentifier)) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }

    const user = await User.findOne({ where: { email: normalizedIdentifier } });

    if (!user) {
      return res.status(404).json({ error: 'No account found for that email address' });
    }

    const otp = generateOtp();
    const expiresAt = await storeOtp({
      identifier: normalizedIdentifier,
      userId: user.id,
      otp,
    });
    const delivery = await sendOtp({
      user,
      identifier: normalizedIdentifier,
      otp,
    });

    return res.json({
      message: 'OTP sent to your email address',
      expiresAt: expiresAt.toISOString(),
      delivery,
    });
  } catch (error) {
    console.error('Forgot password request error:', error);
    return res.status(500).json({ error: 'Unable to send OTP right now' });
  }
});

router.post('/forgot-password/reset', async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body || {};
    const normalizedIdentifier = String(identifier || '').trim().toLowerCase();
    const trimmedOtp = String(otp || '').trim();
    const trimmedPassword = String(newPassword || '');

    if (!normalizedIdentifier || !trimmedOtp || !trimmedPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    if (!isEmailIdentifier(normalizedIdentifier)) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }

    if (trimmedPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const entry = await readOtp(normalizedIdentifier);
    if (!entry) {
      return res.status(400).json({ error: 'Request a fresh OTP first' });
    }

    if (isOtpExpired(entry)) {
      await clearOtp(normalizedIdentifier);
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    if (entry.otp !== trimmedOtp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    const user = await User.findOne({ where: { email: normalizedIdentifier } });

    if (!user || user.id !== entry.userId) {
      await clearOtp(normalizedIdentifier);
      return res.status(404).json({ error: 'Account not found' });
    }

    await user.setPassword(trimmedPassword);
    await user.save();
    await clearOtp(normalizedIdentifier);

    return res.json({
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Forgot password reset error:', error);
    return res.status(500).json({ error: 'Unable to reset password right now' });
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

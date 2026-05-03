import { cacheService } from '../config/redis.js';

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const resetRequests = new Map(); // Fallback for when Redis is unavailable

const maskEmail = (email) => {
  const [localPart = '', domain = ''] = String(email || '').split('@');
  if (!localPart || !domain) return email;
  const visibleLocal = localPart.slice(0, 2);
  return `${visibleLocal}${'*'.repeat(Math.max(localPart.length - 2, 1))}@${domain}`;
};

const buildResetKey = (identifier) => String(identifier || '').trim().toLowerCase();

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const getExpiryDate = () => new Date(Date.now() + OTP_EXPIRY_MS);

const storeOtp = async ({ identifier, userId, otp }) => {
  const expiresAt = getExpiryDate();
  const key = `otp:${buildResetKey(identifier)}`;
  const data = {
    userId,
    otp,
    expiresAt: expiresAt.toISOString(),
  };

  try {
    // Try Redis first
    await cacheService.set(key, data, Math.ceil(OTP_EXPIRY_MS / 1000));
  } catch (error) {
    console.warn('Redis OTP storage failed, using memory fallback:', error.message);
    // Fallback to in-memory storage
    resetRequests.set(buildResetKey(identifier), data);
  }

  return expiresAt;
};

const readOtp = async (identifier) => {
  const key = `otp:${buildResetKey(identifier)}`;

  try {
    // Try Redis first
    const data = await cacheService.get(key);
    if (data) {
      return data;
    }
  } catch (error) {
    console.warn('Redis OTP read failed, trying memory fallback:', error.message);
  }

  // Fallback to in-memory storage
  return resetRequests.get(buildResetKey(identifier)) || null;
};

const clearOtp = async (identifier) => {
  const key = `otp:${buildResetKey(identifier)}`;

  try {
    // Try Redis first
    await cacheService.del(key);
  } catch (error) {
    console.warn('Redis OTP clear failed, trying memory fallback:', error.message);
  }

  // Always clear memory fallback
  resetRequests.delete(buildResetKey(identifier));
};

const isOtpExpired = (entry) => {
  if (!entry?.expiresAt) return true;
  return new Date(entry.expiresAt).getTime() < Date.now();
};

const sendEmailOtp = async ({ email, otp }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return null;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [email],
      subject: 'CodeMastery password reset OTP',
      html: `<p>Your CodeMastery password reset OTP is <strong>${otp}</strong>.</p><p>This code expires in 10 minutes.</p>`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Email delivery failed: ${errorText}`);
  }

  return {
    channel: 'email',
    destination: maskEmail(email),
  };
};
const sendOtp = async ({ user, identifier, otp }) => {
  if (user.email) {
    try {
      const sentEmail = await sendEmailOtp({ email: user.email, otp });
      if (sentEmail) return sentEmail;
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }

      console.warn(
        `[Password Reset OTP] email delivery failed for ${identifier}; falling back to development preview: ${error.message}`
      );
    }
  }

  console.log(`[Password Reset OTP] email=${identifier} otp=${otp} expiresInMinutes=10`);

  return {
    channel: 'email',
    destination: maskEmail(identifier),
    previewCode: process.env.NODE_ENV !== 'production' ? otp : undefined,
    preview: process.env.NODE_ENV !== 'production',
  };
};

export {
  clearOtp,
  generateOtp,
  isOtpExpired,
  readOtp,
  sendOtp,
  storeOtp,
};

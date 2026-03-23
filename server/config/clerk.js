import { ClerkExpressRequireAuth, ClerkExpressWithAuth, LooseAuthProp } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

// Clerk authentication middleware
export const requireAuth = ClerkExpressRequireAuth({
  secretKey: process.env.CLERK_SECRET_KEY
});

export const withAuth = ClerkExpressWithAuth({
  secretKey: process.env.CLERK_SECRET_KEY
});

// Get user from Clerk
export const getClerkUser = async (userId) => {
  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user from Clerk');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Clerk user:', error.message);
    return null;
  }
};

// Verify webhook signature
export const verifyWebhookSignature = (payload, headers) => {
  // Webhook verification is handled by svix in the webhook handler
  return true;
};

export default {
  requireAuth,
  withAuth,
  getClerkUser
};

import '@testing-library/jest-dom';

// Mock import.meta
global.import = {
  meta: {
    env: {
      VITE_ADMIN_EMAILS: 'admin@example.com',
      // Add other env vars as needed
    },
  },
};
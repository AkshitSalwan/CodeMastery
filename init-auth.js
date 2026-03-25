/**
 * Initialize demo accounts in localStorage for testing
 * Run this in the browser console or as a setup script
 */

const demoAccounts = [
  {
    id: 1,
    email: 'admin@codemastery.com',
    password: 'admin123456',
    username: 'admin',
    role: 'admin',
    profile: {
      role: 'admin',
      totalPoints: 0,
      streak: 0,
      problemsSolved: 50,
      bio: 'Admin Account',
      organization: 'CodeMastery',
      availability: 'Full-time',
      title: 'Admin',
      company: 'CodeMastery',
      location: 'Global',
      avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=admin',
      bookmarkedProblems: [],
    }
  },
  {
    id: 2,
    email: 'interviewer@codemastery.com',
    password: 'interview123456',
    username: 'interviewer',
    role: 'interviewer',
    profile: {
      role: 'interviewer',
      totalPoints: 150,
      streak: 5,
      problemsSolved: 20,
      bio: 'Interviewer',
      organization: 'Tech Corp',
      availability: 'Part-time',
      title: 'Senior Engineer',
      company: 'Tech Corp',
      location: 'US',
      avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=interviewer',
      bookmarkedProblems: [],
    }
  },
  {
    id: 11,
    email: 'user@codemastery.com',
    password: 'demo123456',
    username: 'learner',
    role: 'learner',
    profile: {
      role: 'learner',
      totalPoints: 250,
      streak: 3,
      problemsSolved: 15,
      bio: 'Learner',
      organization: '',
      availability: '',
      title: '',
      company: '',
      location: '',
      avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=learner',
      bookmarkedProblems: [],
    }
  }
];

// Initialize localStorage
localStorage.setItem('cm-auth-users', JSON.stringify(demoAccounts));

console.log('✅ Demo accounts initialized in localStorage!');
console.log('Available accounts:');
console.log('  - admin@codemastery.com / admin123456');
console.log('  - interviewer@codemastery.com / interview123456');
console.log('  - user@codemastery.com / demo123456');
console.log('');
console.log('You can now login in the application.');

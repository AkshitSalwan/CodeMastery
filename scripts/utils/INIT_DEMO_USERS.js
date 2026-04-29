// Run this in browser console to initialize demo users
const initializeDemoUsers = () => {
  const users = [
    {
      id: 1,
      email: 'admin@codemastery.com',
      name: 'Admin User',
      password: 'admin123456',
      createdAt: new Date().toISOString(),
      avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=admin',
      profile: {
        id: 1,
        name: 'Admin User',
        email: 'admin@codemastery.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
        totalPoints: 0,
        streak: 0,
        problemsSolved: 0,
        bio: 'System Administrator',
        avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=admin'
      }
    },
    {
      id: 2,
      email: 'user@codemastery.com',
      name: 'Demo User',
      password: 'demo123456',
      createdAt: new Date().toISOString(),
      avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=user',
      profile: {
        id: 2,
        name: 'Demo User',
        email: 'user@codemastery.com',
        role: 'learner',
        createdAt: new Date().toISOString(),
        totalPoints: 0,
        streak: 0,
        problemsSolved: 0,
        bio: 'Demo Learning Account',
        avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=user'
      }
    },
    {
      id: 3,
      email: 'interviewer@codemastery.com',
      name: 'Interviewer',
      password: 'interview123456',
      createdAt: new Date().toISOString(),
      avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=interviewer',
      profile: {
        id: 3,
        name: 'Interviewer',
        email: 'interviewer@codemastery.com',
        role: 'interviewer',
        createdAt: new Date().toISOString(),
        totalPoints: 0,
        streak: 0,
        problemsSolved: 0,
        bio: 'Interview Panel Coordinator',
        avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=interviewer'
      }
    }
  ];

  localStorage.setItem('cm-auth-users', JSON.stringify(users));
  console.log('✅ Demo users initialized!');
  console.log('\nAvailable accounts:');
  console.log('Admin: admin@codemastery.com / admin123456');
  console.log('User: user@codemastery.com / demo123456');
  console.log('Interviewer: interviewer@codemastery.com / interview123456');
};

// Run the function
initializeDemoUsers();

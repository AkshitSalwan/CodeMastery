import { User } from '../models/index.js';

export const createAdminUser = async () => {
  try {
    // Demo users to create
    const demoUsers = [
      {
        email: 'admin@codemastery.com',
        username: 'admin',
        password: 'admin123456',
        role: 'admin',
        is_active: true,
      },
      {
        email: 'interviewer@codemastery.com',
        username: 'interviewer',
        password: 'interview123456',
        role: 'interviewer',
        is_active: true,
      },
      {
        email: 'user@codemastery.com',
        username: 'learner',
        password: 'demo123456',
        role: 'learner',
        is_active: true,
      }
    ];

    for (const userData of demoUsers) {
      try {
        // Check if user already exists
        const userExists = await User.findOne({ 
          where: { email: userData.email }
        });

        if (userExists) {
          console.log(`✓ User already exists: ${userData.email}`);
          continue;
        }

        // Create user
        const user = await User.create({
          email: userData.email,
          username: userData.username,
          role: userData.role,
          is_active: userData.is_active,
          password_hash: 'temp' // Will be overwritten
        });

        // Set the actual password (this hashes it)
        await user.setPassword(userData.password);
        
        // Save the updated password hash
        await user.save();

        console.log(`✓ User created: ${userData.email} (${userData.role})`);
      } catch (userError) {
        console.error(`✗ Error creating user ${userData.email}:`, userError.message);
      }
    }

    console.log('\n✓ Demo accounts initialized successfully');
    console.log('  Admin: admin@codemastery.com / admin123456');
    console.log('  Interviewer: interviewer@codemastery.com / interview123456');
    console.log('  Learner: user@codemastery.com / demo123456');
    console.log('  ⚠️  IMPORTANT: Change these passwords in production!');

    return true;
  } catch (error) {
    console.error('✗ Error in demo user seeder:', error.message);
    console.warn('Demo users could not be created. You can create them manually.');
    return null;
  }
};

export default createAdminUser;

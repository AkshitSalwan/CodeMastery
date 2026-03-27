import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function main() {
  try {
    console.log('🔐 Authenticating...');
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@codemastery.com',
        password: 'demo123456'
      })
    });

    if (!loginRes.ok) {
      console.error('Login failed:', loginRes.status);
      return;
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('✅ Authenticated\n');

    // Test a simple Python submission
    console.log('📤 Testing Python submission for Problem 1...');
    const submitRes = await fetch(`${API_BASE}/problems/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        problem_id: 1,
        code: 'print("test")',
        language: 'python'
      })
    });

    console.log(`Response Status: ${submitRes.status}`);
    const submitData = await submitRes.json();
    console.log('Response Data:', JSON.stringify(submitData, null, 2));

    if (submitRes.ok) {
      console.log('\n✅ Submission was accepted');
    } else {
      console.log('\n❌ Submission failed');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();

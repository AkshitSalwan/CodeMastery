import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function main() {
  try {
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@codemastery.com', password: 'demo123456' })
    });

    const { token } = await loginRes.json();

    // Test Java
    console.log('Testing JAVA submission...\n');
    const javaRes = await fetch(`${API_BASE}/problems/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        problem_id: 1,
        code: 'public class Main { public static void main(String[] args) { System.out.println("test"); } }',
        language: 'java'
      })
    });

    console.log('Status:', javaRes.status);
    const javaData = await javaRes.json();
    console.log('Response:', JSON.stringify(javaData, null, 2));

    // Test C++
    console.log('\n\nTesting CPP submission...\n');
    const cppRes = await fetch(`${API_BASE}/problems/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        problem_id: 1,
        code: '#include <bits/stdc++.h>\nint main() { return 0; }',
        language: 'cpp'
      })
    });

    console.log('Status:', cppRes.status);
    const cppData = await cppRes.json();
    console.log('Response:', JSON.stringify(cppData, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();

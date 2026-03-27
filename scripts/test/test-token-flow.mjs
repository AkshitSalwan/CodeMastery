#!/usr/bin/env node

/**
 * Test script to verify token flow:
 * 1. Login to get JWT token
 * 2. Use token to make authenticated API request
 * 3. Verify token is sent in Authorization header
 */

const API_BASE = 'http://localhost:4000/api';

async function testTokenFlow() {
  console.log('🧪 Testing token flow...\n');

  // Step 1: Login
  console.log('Step 1: Logging in...');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@codemastery.com',
      password: 'demo123456'
    })
  });

  if (!loginRes.ok) {
    console.error('❌ Login failed:', await loginRes.text());
    process.exit(1);
  }

  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('✅ Login successful');
  console.log(`   Token: ${token.substring(0, 20)}...${token.substring(token.length - 10)}\n`);

  // Step 2: Create a question using token
  console.log('Step 2: Creating question with token...');
  const createRes = await fetch(`${API_BASE}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Test Question',
      description: 'This is a test question',
      difficulty: 'easy',
      tags: ['test'],
      test_cases: [
        { input: '1', expected: '1', explanation: 'simple' }
      ]
    })
  });

  const createData = await createRes.json();

  if (!createRes.ok) {
    console.error('❌ Create question failed:', createData);
    process.exit(1);
  }

  console.log('✅ Question created successfully');
  console.log(`   Question ID: ${createData.id}\n`);

  // Step 3: Fetch the question
  console.log('Step 3: Fetching question with token...');
  const getRes = await fetch(`${API_BASE}/questions/${createData.id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const getData = await getRes.json();

  if (!getRes.ok) {
    console.error('❌ Fetch question failed:', getData);
    process.exit(1);
  }

  console.log('✅ Question fetched successfully');
  console.log(`   Title: ${getData.title}`);
  console.log(`   Difficulty: ${getData.difficulty}\n`);

  console.log('✨ All tests passed! Token flow is working correctly.');
}

testTokenFlow().catch(err => {
  console.error('❌ Test error:', err);
  process.exit(1);
});

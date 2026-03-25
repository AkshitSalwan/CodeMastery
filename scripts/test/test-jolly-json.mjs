#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_URL = 'http://localhost:4000/api';

async function getAuthToken() {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@codemastery.com',
        password: 'admin123456'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get auth token');
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('✗ Failed to authenticate:', error.message);
    process.exit(1);
  }
}

async function testJollyProblem() {
  try {
    // Get authentication token
    console.log('🔐 Getting authentication token...');
    const adminToken = await getAuthToken();
    console.log('✓ Authentication successful\n');

    // Read the problem data
    const problemData = JSON.parse(fs.readFileSync(
      `${__dirname}/../../jolly-problem.json`,
      'utf8'
    ));

    console.log('✓ JSON file parsed successfully');
    console.log(`  Problem: "${problemData.title}"`);
    console.log(`  Slug: ${problemData.slug}`);

    // Verify the starter_code is valid JSON
    const starterCode = JSON.parse(problemData.starter_code);
    console.log('✓ Starter code is valid JSON');
    console.log(`  Languages available: ${Object.keys(starterCode).join(', ')}`);

    // Test API endpoint
    console.log('📤 Testing API endpoint...');
    const response = await fetch(`${API_URL}/problems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(problemData)
    });

    const responseText = await response.text();
    console.log(`  Status: ${response.status}`);
    
    if (response.ok) {
      console.log('✓ API accepted the problem!');
      try {
        const result = JSON.parse(responseText);
        console.log('✓ Response:', result);
      } catch (e) {
        console.log('  Response:', responseText);
      }
    } else if (response.status === 400) {
      // Check if it's because problem already exists
      if (responseText.includes('already exists')) {
        console.log('✓ Problem already exists in database!');
        console.log('  This is expected - no need to recreate it.');
      } else {
        console.log('✗ Validation error:', responseText);
      }
    } else if (response.status === 401) {
      console.log('✗ Authentication error');
      console.log('  Response:', responseText);
    } else {
      console.log('✗ Error:', responseText);
    }

    // Verify the problem exists via GET endpoint
    console.log('\n✅ Verifying problem exists...');
    const getResponse = await fetch(`${API_URL}/problems/search-jolly`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (getResponse.ok) {
      const problem = await getResponse.json();
      console.log('✓ Problem found in database!');
      if (problem.data) {
        console.log('  ID:', problem.data.id);
        console.log('  Title:', problem.data.title);
        console.log('  Difficulty:', problem.data.difficulty);
        console.log('  Test Cases:', problem.data.test_cases?.length || 0);
      } else if (problem.id) {
        console.log('  ID:', problem.id);
        console.log('  Title:', problem.title);
        console.log('  Difficulty:', problem.difficulty);
        console.log('  Test Cases:', problem.test_cases?.length || 0);
      } else {
        console.log('  Response:', JSON.stringify(problem, null, 2));
      }
    } else if (getResponse.status === 404) {
      console.log('⚠ Problem not found via GET (may need to be created first)');
    } else {
      console.log('⚠ Could not verify problem:', getResponse.status);
    }

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

testJollyProblem();

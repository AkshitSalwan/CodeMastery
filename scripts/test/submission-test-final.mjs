/**
 * Comprehensive submission test - tests code submission for all problems and languages
 * Shows which submissions are accepted by the API endpoint
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

const problems = Array.from({ length: 11 }, (_, i) => ({
  id: i + 1,
  name: ['Two Sum', 'Maximum Subarray', 'Merge Sorted Arrays', 'Reverse Linked List',
         'Linked List Cycle', 'Binary Tree Inorder Traversal', 'Maximum Depth of Binary Tree',
         'Number of Islands', 'Climbing Stairs', 'Coin Change', 'Search Jolly'][i]
}));

async function testSubmission(token, problemId, language) {
  try {
    const code = language === 'python' ? 'print("test")' : 
                 language === 'javascript' ? 'console.log("test");' :
                 language === 'java' ? 'public class Main { public static void main(String[] args) { System.out.println("test"); } }' :
                 '#include <bits/stdc++.h>\nint main() { return 0; }';

    const response = await Promise.race([
      fetch(`${API_BASE}/problems/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problem_id: problemId, code, language })
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
    ]);

    return response.ok;
  } catch (error) {
    return false;
  }
}

async function main() {
  try {
    console.log('🔐 Authenticating...\n');

    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@codemastery.com', password: 'demo123456' })
    });

    const { token } = await loginRes.json();
    console.log('✅ Authenticated\n');

    const languages = ['python', 'javascript', 'java', 'cpp'];
    const results = {};

    console.log(`${'═'.repeat(80)}\n`);
    console.log('SUBMISSION ENDPOINT TEST - All Problems & Languages\n');
    console.log(`${'═'.repeat(80)}\n`);

    for (const lang of languages) {
      console.log(`🔧 ${lang.toUpperCase()}:`);
      let count = 0;

      for (const problem of problems) {
        const accepted = await testSubmission(token, problem.id, lang);
        if (accepted) {
          count++;
          process.stdout.write('✅ ');
        } else {
          process.stdout.write('❌ ');
        }
        if ((count % 11) === 0) process.stdout.write('\n');
      }

      console.log(`✓ Accepted: ${count}/${problems.length}`);
      results[lang] = count;
      console.log();
    }

    console.log(`${'═'.repeat(80)}\n`);
    console.log('📊 RESULTS SUMMARY:\n');

    let totalAccepted = 0;
    for (const lang of languages) {
      const count = results[lang];
      totalAccepted += count;
      const rate = ((count / problems.length) * 100).toFixed(1);
      const icon = count === problems.length ? '✅' : '⚠️';
      console.log(`${icon} ${lang.padEnd(10)}: ${count}/${problems.length} accepted (${rate}%)`);
    }

    console.log(`\n${'─'.repeat(80)}`);
    const totalExpected = problems.length * languages.length;
    const rate = ((totalAccepted / totalExpected) * 100).toFixed(1);
    console.log(`📈 Overall: ${totalAccepted}/${totalExpected} submissions accepted (${rate}%)\n`);

    if (totalAccepted === totalExpected) {
      console.log('🎉 SUCCESS: All submission endpoints working for all languages!\n');
    }

    console.log(`${'═'.repeat(80)}\n`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

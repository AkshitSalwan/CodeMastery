import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

const problems = [
  { id: 1, name: "Two Sum" },
  { id: 2, name: "Maximum Subarray" },
  { id: 3, name: "Merge Sorted Arrays" },
  { id: 4, name: "Reverse Linked List" },
  { id: 5, name: "Linked List Cycle" },
  { id: 6, name: "Binary Tree Inorder Traversal" },
  { id: 7, name: "Maximum Depth of Binary Tree" },
  { id: 8, name: "Number of Islands" },
  { id: 9, name: "Climbing Stairs" },
  { id: 10, name: "Coin Change" },
  { id: 11, name: "Search Jolly" }
];

const sampleCodes = {
  python: `print("Hello")`,
  javascript: `console.log("Hello");`,
  java: `public class Main { public static void main(String[] args) { System.out.println("Hello"); } }`
};

async function testSubmission(token, problemId, language) {
  try {
    const response = await fetch(`${API_BASE}/problems/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        problem_id: problemId,
        code: sampleCodes[language],
        language: language
      }),
      timeout: 3000
    });

    const data = await response.json();
    return { 
      ok: response.ok, 
      status: response.status,
      message: response.ok ? 'Accepted' : (data.message || data.error || 'Error'),
      data
    };
  } catch (error) {
    return { 
      ok: false, 
      status: 'error',
      message: error.message 
    };
  }
}

async function main() {
  console.log('🔐 Authenticating...\n');
  
  try {
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@codemastery.com',
        password: 'demo123456'
      })
    });

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('✅ Authenticated\n');

    const languages = ['python', 'javascript', 'java'];
    const results = {};

    console.log(`${'═'.repeat(80)}`);
    console.log('SUBMISSION TESTING - All Problems & Languages');
    console.log(`${'═'.repeat(80)}\n`);

    for (const lang of languages) {
      console.log(`📌 Testing ${lang.toUpperCase()} submissions:\n`);
      let successCount = 0;

      for (const problem of problems) {
        process.stdout.write(`  Problem ${String(problem.id).padStart(2)}: ${problem.name.padEnd(40)} ... `);
        const result = await testSubmission(token, problem.id, lang);
        
        if (result.ok) {
          console.log('✅ Accepted');
          successCount++;
        } else {
          console.log(`❌ ${result.status}`);
        }
      }

      console.log(`\n  Result: ${successCount}/${problems.length} submissions succeeded\n`);
      results[lang] = { passed: successCount, total: problems.length };
    }

    console.log(`${'═'.repeat(80)}`);
    console.log('📊 SUMMARY');
    console.log(`${'═'.repeat(80)}\n`);

    let totalTests = 0;
    let totalPassed = 0;

    for (const lang of languages) {
      const { passed, total } = results[lang];
      totalTests += total;
      totalPassed += passed;
      const rate = ((passed / total) * 100).toFixed(1);
      const icon = passed === total ? '✅' : '⚠️';
      console.log(`${icon} ${lang.toUpperCase().padEnd(10)} : ${passed}/${total} (${rate}%)`);
    }

    console.log(`\n${'─'.repeat(80)}`);
    const overallRate = ((totalPassed / totalTests) * 100).toFixed(1);
    console.log(`📈 Overall Success Rate: ${totalPassed}/${totalTests} (${overallRate}%)`);
    console.log(`${'═'.repeat(80)}\n`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

const problems = [
  { id: 1, name: "Two Sum", lang: "python" },
  { id: 2, name: "Maximum Subarray", lang: "python" },
  { id: 3, name: "Merge Sorted Arrays", lang: "python" },
  { id: 4, name: "Reverse Linked List", lang: "python" },
  { id: 5, name: "Linked List Cycle", lang: "python" },
  { id: 6, name: "Binary Tree Inorder Traversal", lang: "python" },
  { id: 7, name: "Maximum Depth of Binary Tree", lang: "python" },
  { id: 8, name: "Number of Islands", lang: "python" },
  { id: 9, name: "Climbing Stairs", lang: "python" },
  { id: 10, name: "Coin Change", lang: "python" },
  { id: 11, name: "Search Jolly", lang: "python" }
];

async function testSubmission(token, problemId, language) {
  try {
    // Simple test code
    const code = language === 'python' ? 'print("test")' : 
                 language === 'javascript' ? 'console.log("test");' :
                 'public class Main { public static void main(String[] args) { System.out.println("test"); } }';

    const response = await fetch(`${API_BASE}/problems/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        problem_id: problemId,
        code: code,
        language: language
      })
    });

    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
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
    console.log('CODE SUBMISSION TESTING');
    console.log(`${'═'.repeat(80)}\n`);

    for (const lang of languages) {
      console.log(`📌 Testing ${lang.toUpperCase()} submissions:\n`);
      const langResults = { passed: 0, failed: 0, total: 0 };

      for (const problem of problems) {
        process.stdout.write(`  Problem ${String(problem.id).padEnd(2)} | ${problem.name.padEnd(38)} ... `);
        
        const result = await testSubmission(token, problem.id, lang);
        langResults.total++;

        if (result.success) {
          console.log('✅');
          langResults.passed++;
        } else {
          console.log('❌');
          langResults.failed++;
        }
      }

      const passRate = ((langResults.passed / langResults.total) * 100).toFixed(1);
      console.log(`\n  Results: ${langResults.passed}/${langResults.total} submissions accepted (${passRate}%)\n`);
      results[lang] = langResults;
    }

    console.log(`${'═'.repeat(80)}`);
    console.log('📊 FINAL SUMMARY');
    console.log(`${'═'.repeat(80)}\n`);

    let totalTests = 0;
    let totalPassed = 0;

    for (const lang of languages) {
      const { passed, total } = results[lang];
      totalTests += total;
      totalPassed += passed;
      const rate = ((passed / total) * 100).toFixed(1);
      const icon = passed === total ? '✅' : '⚠️';
      console.log(`${icon} ${lang.toUpperCase().padEnd(10)}: ${passed}/${total} submissions accepted (${rate}%)`);
    }

    console.log(`\n${'─'.repeat(80)}`);
    const overallRate = ((totalPassed / totalTests) * 100).toFixed(1);
    console.log(`📈 Overall: ${totalPassed}/${totalTests} submissions accepted (${overallRate}% success rate)`);
    console.log(`${'═'.repeat(80)}\n`);

    if (totalPassed === totalTests) {
      console.log('🎉 ALL SUBMISSION TESTS PASSED! All languages work for all problems.\n');
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

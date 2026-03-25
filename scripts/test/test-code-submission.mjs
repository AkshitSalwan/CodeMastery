import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testCodeSubmission() {
  try {
    console.log('🔐 Step 1: Authenticating...\n');
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@codemastery.com',
        password: 'demo123456'
      })
    });

    if (!loginRes.ok) {
      console.error('❌ Login failed:', loginRes.status);
      return;
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('✅ Logged in successfully');
    console.log(`Token: ${token.slice(0, 20)}...\n`);

    // Test solutions for different problems
    const tests = [
      {
        problemId: 1,
        title: "Two Sum",
        code: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []

if __name__ == "__main__":
    nums = list(map(int, input().split()))
    target = int(input())
    result = twoSum(nums, target)
    print(' '.join(map(str, result)))`,
        language: 'python'
      },
      {
        problemId: 9,
        title: "Climbing Stairs",
        code: `def climbStairs(n):
    if n <= 1:
        return n
    a, b = 1, 1
    for _ in range(2, n+1):
        a, b = b, a + b
    return b

if __name__ == "__main__":
    n = int(input())
    print(climbStairs(n))`,
        language: 'python'
      },
      {
        problemId: 11,
        title: "Search Jolly",
        code: `def check_words(arr):
    for word in arr:
        if word == "jolly":
            return True
        if word == "bunts":
            return "biceps"
    return False

if __name__ == "__main__":
    input_str = input().strip()
    arr = input_str.split()
    result = check_words(arr)
    print(result)`,
        language: 'python'
      }
    ];

    console.log(`${'═'.repeat(80)}\n`);
    console.log('📤 SUBMITTING CODE SOLUTIONS\n');
    console.log(`${'═'.repeat(80)}\n`);

    let successCount = 0;

    for (const test of tests) {
      console.log(`\n📝 Problem ${test.problemId}: ${test.title}`);
      console.log(`Language: ${test.language}`);
      console.log('-'.repeat(60));

      const submitRes = await fetch(`${API_BASE}/problems/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problem_id: test.problemId,
          code: test.code,
          language: test.language
        })
      });

      console.log(`Response Status: ${submitRes.status}`);

      if (submitRes.ok) {
        const data = await submitRes.json();
        console.log(`✅ ACCEPTED`);
        console.log(`   Verdict: ${data.submission.verdict}`);
        console.log(`   Tests Passed: ${data.submission.passed_tests}/${data.submission.total_tests}`);
        console.log(`   Runtime: ${data.submission.runtime}s`);
        console.log(`   Memory: ${data.submission.memory} bytes`);
        successCount++;
      } else {
        const error = await submitRes.json();
        console.log(`❌ FAILED`);
        console.log(`   Error: ${error.error || error.message}`);
      }
    }

    console.log(`\n${'═'.repeat(80)}`);
    console.log(`\n📊 SUMMARY: ${successCount}/${tests.length} submissions successful\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCodeSubmission();

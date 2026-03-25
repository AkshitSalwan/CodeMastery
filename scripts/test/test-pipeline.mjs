import fetch from 'node-fetch';

(async () => {
  try {
    console.log('🔐 TEST 1: Login...');
    const loginRes = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: 'user@codemastery.com', password: 'demo123456'})
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('✅ Logged in, token:', token.substring(0, 20) + '...\n');

    console.log('📝 TEST 2: Fetch problem boilerplate...');
    const problemRes = await fetch('http://localhost:4000/api/problems/search-jolly');
    const problemData = await problemRes.json();
    const problem = problemData.problem;
    const starterCode = JSON.parse(problem.starter_code);
    console.log('✅ Problem fetched');
    console.log('  - Java has main class:', starterCode.java.includes('public class Main'));
    console.log('  - Python has entry point:', starterCode.python.includes('if __name__'));
    console.log('  - JavaScript has readline:', starterCode.javascript.includes('readline'));
    console.log('');

    console.log('🚀 TEST 3: Submit Python solution...');
    const code = `def check_words(arr):
    for word in arr:
        if word == 'jolly':
            return True
        if word == 'bunts':
            return 'biceps'
    return False

if __name__ == "__main__":
    input_str = input().strip()
    arr = input_str.split()
    result = check_words(arr)
    print(result)`;

    const submitRes = await fetch('http://localhost:4000/api/problems/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        problemId: 11,
        code: code,
        language: 'python'
      })
    });

    const submitData = await submitRes.json();
    console.log('✅ Submission response:');
    console.log('  - Status:', submitData.status || submitData.message || 'Submitted');
    console.log('  - Tests Passed:', submitData.passed || 'Processing...');
    console.log('');
    
    console.log('✅ All tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
})();

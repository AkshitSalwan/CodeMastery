import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

// Test solutions for different problems
const testSubmissions = [
  {
    problemId: 1,
    title: "Two Sum",
    py: `def twoSum(nums, target):
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
    
    js: `function twoSum(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i+1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line.trim());
    if (lines.length === 2) {
        const nums = lines[0].split(' ').map(Number);
        const target = Number(lines[1]);
        const result = twoSum(nums, target);
        console.log(result.join(' '));
        rl.close();
    }
});`,
    
    java: `import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i+1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);
        int target = Integer.parseInt(sc.nextLine().trim());
        int[] result = twoSum(nums, target);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.length; i++) {
            if (i > 0) sb.append(" ");
            sb.append(result[i]);
        }
        System.out.println(sb.toString());
    }
}`,
  },
  {
    problemId: 2,
    title: "Maximum Subarray",
    py: `def maxSubArray(nums):
    max_sum = nums[0]
    current_sum = nums[0]
    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
    return max_sum

if __name__ == "__main__":
    nums = list(map(int, input().split()))
    print(maxSubArray(nums))`,
    
    js: `function maxSubArray(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, terminal: false });

rl.on('line', (line) => {
    const nums = line.trim().split(' ').map(Number);
    console.log(maxSubArray(nums));
    rl.close();
});`,
    
    java: `import java.util.*;

public class Main {
    public static int maxSubArray(int[] nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);
        System.out.println(maxSubArray(nums));
    }
}`,
  },
  {
    problemId: 9,
    title: "Climbing Stairs",
    py: `def climbStairs(n):
    if n <= 1:
        return n
    a, b = 1, 1
    for _ in range(2, n+1):
        a, b = b, a + b
    return b

if __name__ == "__main__":
    n = int(input())
    print(climbStairs(n))`,
    
    js: `function climbStairs(n) {
    if (n <= 1) return n;
    let [a, b] = [1, 1];
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, terminal: false });

rl.on('line', (line) => {
    const n = Number(line.trim());
    console.log(climbStairs(n));
    rl.close();
});`,
    
    java: `import java.util.*;

public class Main {
    public static int climbStairs(int n) {
        if (n <= 1) return n;
        int a = 1, b = 1;
        for (int i = 2; i <= n; i++) {
            int temp = b;
            b = a + b;
            a = temp;
        }
        return b;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        System.out.println(climbStairs(n));
    }
}`,
  },
  {
    problemId: 11,
    title: "Search Jolly",
    py: `def check_words(arr):
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
    
    js: `function checkWords(arr) {
    for (let word of arr) {
        if (word === "jolly") return true;
        if (word === "bunts") return "biceps";
    }
    return false;
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

let input = '';
rl.on('line', (line) => {
    input = line.trim();
    const arr = input.split(' ');
    const result = checkWords(arr);
    console.log(result);
    rl.close();
});`,
    
    java: `import java.util.*;

public class Main {
    public static Object checkWords(String[] arr) {
        for (String word : arr) {
            if (word.equals("jolly")) return true;
            if (word.equals("bunts")) return "biceps";
        }
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine().trim();
        String[] arr = input.split(" ");
        Object result = checkWords(arr);
        System.out.println(result);
    }
}`,
  }
];

async function testSubmission(token, problemId, code, language) {
  try {
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
      }),
      timeout: 8000
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || data.error || 'Unknown error' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  try {
    console.log('🔐 Authenticating...\n');
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

    const results = {};
    let totalTests = 0;
    let passedTests = 0;

    for (const problem of testSubmissions) {
      results[problem.title] = {};
      console.log(`${'═'.repeat(70)}`);
      console.log(`📝 Problem ${problem.problemId}: ${problem.title}`);
      console.log(`${'═'.repeat(70)}`);

      for (const [lang, code] of Object.entries({ python: problem.py, javascript: problem.js, java: problem.java })) {
        process.stdout.write(`  🔧 ${lang.padEnd(10)} ... `);
        
        const result = await testSubmission(token, problem.problemId, code, lang);
        totalTests++;

        if (result.success) {
          console.log('✅ Success');
          results[problem.title][lang] = 'success';
          passedTests++;
        } else {
          console.log(`❌ ${result.error}`);
          results[problem.title][lang] = `error: ${result.error}`;
        }
      }
      console.log();
    }

    console.log(`${'═'.repeat(70)}`);
    console.log('📊 SUBMISSION TEST RESULTS');
    console.log(`${'═'.repeat(70)}`);
    console.log(`Total submissions: ${totalTests}`);
    console.log(`Passed: ${passedTests}/${totalTests}`);
    console.log(`Success rate: ${((passedTests/totalTests)*100).toFixed(1)}%\n`);

    // Summary table
    console.log('📋 Detailed Results:');
    Object.entries(results).forEach(([problem, langs]) => {
      const allPassed = Object.values(langs).every(r => r === 'success');
      const icon = allPassed ? '✅' : '⚠️';
      console.log(`${icon} ${problem}`);
      Object.entries(langs).forEach(([lang, status]) => {
        const statusIcon = status === 'success' ? '  ✅' : '  ❌';
        console.log(`${statusIcon} ${lang.padEnd(10)} ${status}`);
      });
    });

    console.log(`\n${'═'.repeat(70)}\n`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

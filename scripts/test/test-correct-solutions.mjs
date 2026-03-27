import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

// Correct working solutions
const correctSolutions = {
  python: `def twoSum(nums, target):
    # Correct solution
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
    
  javascript: `function twoSum(nums, target) {
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
});`
};

async function testCorrectCode() {
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

    console.log(`${'═'.repeat(80)}\n`);
    console.log('TESTING CORRECT SOLUTIONS - Problem 1: Two Sum\n');
    console.log(`${'═'.repeat(80)}\n`);

    for (const [lang, code] of Object.entries(correctSolutions)) {
      console.log(`\n📝 Testing ${lang.toUpperCase()}:\n`);
      
      const response = await fetch(`${API_BASE}/problems/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problem_id: 1,
          code: code,
          language: lang
        })
      });

      console.log(`Status: ${response.status}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Submission Accepted\n');
        console.log('Response Data:');
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log('❌ Submission Failed\n');
        console.log('Error Response:');
        console.log(JSON.stringify(data, null, 2));
      }
      
      console.log(`\n${'─'.repeat(80)}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCorrectCode();

// Run this in browser console at http://localhost:3000 to add the Search Jolly problem

const jollyProblem = {
  id: Date.now(),
  slug: 'search-jolly-' + Date.now(),
  title: 'Search Jolly',
  description: `You need to find if "jolly" exists in the array of strings or not.

**Rules:**
- If "jolly" exists in the array, return **true**
- If "bunts" exists in the array, return **"biceps"**
- If neither exists, return **false**

**Function Signature:**
\`\`\`java
public static Object checkWords(String[] arr)
\`\`\`

**Input Format:**
- A single line containing space-separated strings

**Output Format:**
- true (if "jolly" found)
- "biceps" (if "bunts" found)
- false (if neither found)`,
  
  difficulty: 'Easy',
  tags: ['Array', 'String', 'Search'],
  constraints: [
    '1 <= arr.length <= 100',
    'Each string contains only lowercase letters',
    'String length <= 20'
  ],
  
  examples: [
    {
      input: 'jolly happy sad',
      output: 'true',
      explanation: 'The word "jolly" is present in the array'
    },
    {
      input: 'bunts crazy wild',
      output: 'biceps',
      explanation: 'The word "bunts" is present, so return "biceps"'
    },
    {
      input: 'happy sad mad',
      output: 'false',
      explanation: 'Neither "jolly" nor "bunts" are present'
    }
  ],
  
  test_cases: [
    {
      input: 'jolly',
      output: 'true',
      explanation: 'Single word "jolly"'
    },
    {
      input: 'hello jolly world',
      output: 'true',
      explanation: '"jolly" exists in middle'
    },
    {
      input: 'bunts',
      output: 'biceps',
      explanation: 'Single word "bunts"'
    },
    {
      input: 'nothing here',
      output: 'false',
      explanation: 'Neither word exists'
    }
  ],
  
  hidden_test_cases: [
    {
      input: 'jolly jolly jolly',
      output: 'true'
    },
    {
      input: 'bunts bunts',
      output: 'biceps'
    },
    {
      input: 'joll bunt',
      output: 'false'
    },
    {
      input: 'happy sad mad angry jolly',
      output: 'true'
    },
    {
      input: 'crazy insane bunts wild',
      output: 'biceps'
    }
  ],
  
  hints: [
    'Use a loop to iterate through the array of strings',
    'Compare each word with "jolly" and "bunts" using .equals()',
    'Keep track of whether you found each word separately',
    'Check for "jolly" first, then "bunts", then return false if neither found',
    'Remember that priority matters: jolly takes precedence over bunts'
  ],
  
  starter_code: {
    java: 'public static Object checkWords(String[] arr) {\n    // Your code here\n    return false;\n}',
    python: 'def check_words(arr):\n    # Your code here\n    return False',
    javascript: 'function checkWords(arr) {\n    // Your code here\n    return false;\n}'
  },
  
  time_limit: 1000,
  memory_limit: 256,
  points: 50,
  created_at: new Date().toISOString(),
  status: 'published'
};

// Add to localStorage
const existingProblems = JSON.parse(localStorage.getItem('customQuestions') || '[]');
existingProblems.push(jollyProblem);
localStorage.setItem('customQuestions', JSON.stringify(existingProblems));

console.log('✅ Search Jolly problem created successfully!');
console.log('📌 Problem ID:', jollyProblem.id);
console.log('📝 Test cases: 4 visible + 5 hidden');
console.log('💡 Hints: 5 hints included');
console.log('🎯 Available at /problems');

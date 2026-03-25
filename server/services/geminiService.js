const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

/**
 * Call the Gemini API with a prompt
 * @param {string} prompt - The prompt to send to Gemini
 * @param {string} responseMimeType - Response format (default: application/json)
 * @returns {Promise<string|null>} - The generated text or null if failed
 */
const callGemini = async (prompt, responseMimeType = 'application/json') => {
  if (!GEMINI_API_KEY || !globalThis.fetch) {
    console.warn('Gemini API key not configured or fetch unavailable');
    return null;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType,
          },
        }),
        signal:
          typeof AbortSignal !== 'undefined' && AbortSignal.timeout
            ? AbortSignal.timeout(30000)
            : undefined,
      }
    );

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || null;
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    return null;
  }
};

/**
 * Generate test cases for a problem using Gemini AI
 * @param {object} problemData - Problem details (title, description, difficulty, constraints)
 * @returns {Promise<object>} - Object containing test_cases and hidden_test_cases arrays
 */
export const generateTestCases = async (problemData) => {
  const { title, description, difficulty, constraints = [] } = problemData;

  const prompt = `You are an expert software engineer and problem setter. Generate comprehensive test cases for a coding problem.

Problem Title: ${title}
Problem Description: ${description}
Difficulty Level: ${difficulty}
Constraints: ${constraints.join(', ') || 'None specified'}

Generate test cases in the following JSON format:
{
  "visible_test_cases": [
    {
      "input": "input value(s) as string",
      "output": "expected output as string",
      "explanation": "brief explanation of this test case"
    }
  ],
  "hidden_test_cases": [
    {
      "input": "input value(s) as string",
      "output": "expected output as string"
    }
  ]
}

Requirements:
1. Create 3-4 visible test cases (shown to users) with explanations
2. Create 8-10 hidden test cases (for evaluation) that cover:
   - Edge cases (empty inputs, single elements, extreme values)
   - Boundary conditions (max/min values, off-by-one scenarios)
   - Normal cases with varying input sizes
   - Special cases (duplicates, negative numbers, zeros, etc.)
3. Visible test cases should have clear explanations
4. Hidden test cases should vary in difficulty and cover corner cases
5. Ensure both input and output are valid strings that match the problem's I/O format
6. Test cases should progressively increase in difficulty from visible to hidden

Return ONLY valid JSON, nothing else.`;

  const generatedText = await callGemini(prompt);

  if (!generatedText) {
    console.warn('Failed to generate test cases with Gemini, using fallback');
    return generateFallbackTestCases(problemData);
  }

  try {
    // Try to parse the generated JSON
    const parsed = JSON.parse(generatedText);
    
    // Validate the structure
    if (!Array.isArray(parsed.visible_test_cases) || !Array.isArray(parsed.hidden_test_cases)) {
      throw new Error('Invalid test case structure');
    }

    return {
      test_cases: parsed.visible_test_cases,
      hidden_test_cases: parsed.hidden_test_cases,
    };
  } catch (error) {
    console.error('Failed to parse Gemini response:', error.message);
    return generateFallbackTestCases(problemData);
  }
};

/**
 * Fallback test case generation when Gemini is unavailable
 * @param {object} problemData - Problem details
 * @returns {object} - Basic test cases
 */
const generateFallbackTestCases = (problemData) => {
  const { difficulty } = problemData;
  
  // Generate basic test cases based on difficulty
  const baseTestCases = [
    {
      input: 'sample input 1',
      output: 'expected output 1',
      explanation: 'Basic test case',
    },
    {
      input: 'sample input 2',
      output: 'expected output 2',
      explanation: 'Second test case',
    },
  ];

  if (difficulty === 'Medium' || difficulty === 'Hard') {
    baseTestCases.push({
      input: 'edge case input',
      output: 'edge case output',
      explanation: 'Edge case test',
    });
  }

  if (difficulty === 'Hard') {
    baseTestCases.push({
      input: 'complex input',
      output: 'complex output',
      explanation: 'Complex test case',
    });
  }

  // Hidden test cases - generated based on difficulty
  const hiddenTestCases = [];
  const hiddenCount = difficulty === 'Easy' ? 5 : difficulty === 'Medium' ? 8 : 10;
  
  for (let i = 0; i < hiddenCount; i++) {
    hiddenTestCases.push({
      input: `hidden test input ${i + 1}`,
      output: `hidden test output ${i + 1}`,
    });
  }

  return {
    test_cases: baseTestCases,
    hidden_test_cases: hiddenTestCases,
  };
};

/**
 * Generate hints for a problem using Gemini AI
 * @param {object} problemData - Problem details
 * @returns {Promise<string[]>} - Array of hints
 */
export const generateHints = async (problemData) => {
  const { title, description, difficulty } = problemData;

  const prompt = `You are an expert coding mentor. Generate 4-5 helpful hints for solving this coding problem.

Problem Title: ${title}
Problem Description: ${description}
Difficulty: ${difficulty}

Generate hints in JSON format:
{
  "hints": [
    "First hint - start with the approach",
    "Second hint - mention a key insight",
    "Third hint - suggest a data structure",
    "Fourth hint - hint at optimization"
  ]
}

Requirements:
1. Hints should guide without giving away the solution
2. Progress from basic approach to optimization
3. For Easy problems: focus on understanding the problem
4. For Medium: suggest data structures and approaches
5. For Hard: hint at optimal complexity and trade-offs
6. Keep each hint concise (1-2 sentences)

Return ONLY valid JSON.`;

  const generatedText = await callGemini(prompt);

  if (!generatedText) {
    return generateFallbackHints(difficulty);
  }

  try {
    const parsed = JSON.parse(generatedText);
    return Array.isArray(parsed.hints) ? parsed.hints : generateFallbackHints(difficulty);
  } catch (error) {
    console.error('Failed to parse hints response:', error.message);
    return generateFallbackHints(difficulty);
  }
};

/**
 * Fallback hints generation
 * @param {string} difficulty - Problem difficulty level
 * @returns {string[]} - Basic hints
 */
const generateFallbackHints = (difficulty) => {
  if (difficulty === 'Easy') {
    return [
      'Read and understand the problem carefully.',
      'Identify the inputs and outputs.',
      'Think about a simple brute force approach first.',
      'Consider if there are any obvious edge cases.',
    ];
  } else if (difficulty === 'Medium') {
    return [
      'Think about what data structure might help.',
      'Consider if sorting could be useful.',
      'Think about a two-pointer or sliding window approach.',
      'What is the time complexity of your current solution?',
      'Can you optimize it further?',
    ];
  } else {
    return [
      'This problem might require a specific algorithm.',
      'Think about dynamic programming or graph algorithms.',
      'What are the state transitions?',
      'Consider the optimal time and space complexity.',
      'Work through a detailed example on paper first.',
    ];
  }
};

/**
 * Generate solution explanation for a problem
 * @param {object} problemData - Problem details
 * @returns {Promise<string>} - Solution explanation
 */
export const generateSolutionExplanation = async (problemData) => {
  const { title, description, difficulty } = problemData;

  const prompt = `You are an expert algorithm educator. Write a comprehensive solution explanation for this problem.

Problem Title: ${title}
Problem Description: ${description}
Difficulty: ${difficulty}

Write a solution explanation in markdown format with:
1. Approach explanation (2-3 sentences)
2. Algorithm steps (numbered list)
3. Time Complexity analysis
4. Space Complexity analysis
5. Key insights and trade-offs
6. When to use this approach

Be concise but thorough. Assume readers have basic coding knowledge.`;

  const generatedText = await callGemini(prompt, 'text/plain');

  if (!generatedText) {
    return generateFallbackExplanation(difficulty);
  }

  return generatedText;
};

/**
 * Fallback solution explanation
 * @param {string} difficulty - Problem difficulty
 * @returns {string} - Basic explanation template
 */
const generateFallbackExplanation = (difficulty) => {
  return `# Solution Explanation

## Approach
This problem requires careful analysis of the problem constraints and choosing an appropriate algorithm.

## Algorithm
1. Understand the problem requirements
2. Identify edge cases
3. Choose an appropriate data structure
4. Implement the solution
5. Test with various test cases

## Complexity Analysis
- **Time Complexity**: Depends on chosen algorithm
- **Space Complexity**: Depends on data structures used

## Key Insights
- ${difficulty === 'Easy' ? 'Focus on clarity and correctness' : difficulty === 'Medium' ? 'Consider multiple approaches and their trade-offs' : 'Optimize for the best possible time complexity'}
- Handle edge cases carefully
- Test with sample inputs

## When to Use
This approach is best when the constraints allow it and the problem requirements match.`;
};

/**
 * Generate a complete problem specification
 * @param {object} problemData - Partial problem data
 * @returns {Promise<object>} - Complete problem specification
 */
export const generateCompleteProblemSpec = async (problemData) => {
  const { title, description, difficulty } = problemData;

  try {
    const [testCases, hints, explanation] = await Promise.all([
      generateTestCases(problemData),
      generateHints(problemData),
      generateSolutionExplanation(problemData),
    ]);

    return {
      success: true,
      title,
      description,
      difficulty,
      test_cases: testCases.test_cases,
      hidden_test_cases: testCases.hidden_test_cases,
      hints,
      explanation,
      generated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating complete problem spec:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  generateTestCases,
  generateHints,
  generateSolutionExplanation,
  generateCompleteProblemSpec,
  callGemini,
};

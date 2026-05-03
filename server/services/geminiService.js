const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const GEMINI_MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
].filter(Boolean);
let lastGeminiError = '';

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

  const errors = [];
  lastGeminiError = '';

  for (const model of GEMINI_MODEL_CANDIDATES) {
    try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
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
      const errorBody = await response.text().catch(() => '');
      const lastError = `${model}: ${response.status} ${response.statusText} ${errorBody}`.trim();
      errors.push(lastError);
      console.error(`Gemini API error: ${lastError}`);
      continue;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || null;
  } catch (error) {
      const lastError = `${model}: ${error.message}`;
      errors.push(lastError);
      console.error('Error calling Gemini API:', lastError);
    }
  }

  if (errors.length > 0) {
    lastGeminiError = summarizeGeminiErrors(errors);
    console.error(`Gemini API failed for all configured models. ${lastGeminiError}`);
  }

  return null;
};

const summarizeGeminiErrors = (errors) => {
  const priorityError =
    errors.find((error) => error.includes('reported as leaked')) ||
    errors.find((error) => error.includes('PERMISSION_DENIED')) ||
    errors.find((error) => error.includes('RESOURCE_EXHAUSTED')) ||
    errors.find((error) => error.includes('Too Many Requests')) ||
    errors[errors.length - 1];

  return priorityError
    .replace(/\s+/g, ' ')
    .replace(/https:\/\/[^\s"]+/g, (url) => url.replace(/[),.]+$/, ''));
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
    const parsed = parseJsonLikeResponse(generatedText);
    
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
  const {
    title = '',
    description = '',
    difficulty = 'Medium',
    examples = [],
  } = problemData;

  const exampleBased = examples
    .filter((ex) => ex && typeof ex.input === 'string' && typeof ex.output === 'string')
    .slice(0, 3)
    .map((ex, idx) => ({
      input: ex.input,
      output: ex.output,
      explanation: ex.explanation || `Example-derived test case ${idx + 1}`,
    }));

  if (exampleBased.length > 0) {
    return {
      test_cases: exampleBased,
      hidden_test_cases: buildHiddenFromVisible(exampleBased, difficulty),
    };
  }

  const searchableText = `${title} ${description}`.toLowerCase();
  if (isSortedArraySearchProblem(searchableText)) {
    return buildSortedArraySearchCases(difficulty);
  }

  return buildContextualGenericCases({ title, description, difficulty });
};

const parseJsonLikeResponse = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty AI response');
  }

  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from markdown fences or mixed content
    const fenceMatch = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/i);
    if (fenceMatch?.[1]) {
      return JSON.parse(fenceMatch[1].trim());
    }

    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    }

    throw new Error('No parseable JSON found');
  }
};

const isSortedArraySearchProblem = (text) => {
  return text.includes('search') && text.includes('array') && text.includes('sorted');
};

const buildSortedArraySearchCases = (difficulty) => {
  const visible = [
    {
      input: '5\n1 3 5 7 9\n7',
      output: '3',
      explanation: 'Target 7 is present at 0-based index 3.',
    },
    {
      input: '6\n2 4 6 8 10 12\n5',
      output: '-1',
      explanation: 'Target 5 does not exist in the sorted array.',
    },
  ];

  if (difficulty === 'Medium' || difficulty === 'Hard') {
    visible.push({
      input: '1\n42\n42',
      output: '0',
      explanation: 'Single-element array where the target is found.',
    });
  }

  const hidden = [
    { input: '1\n42\n7', output: '-1' },
    { input: '8\n-10 -5 -2 0 3 4 8 12\n-10', output: '0' },
    { input: '8\n-10 -5 -2 0 3 4 8 12\n12', output: '7' },
    { input: '7\n1 1 2 2 3 3 4\n2', output: '2' },
    { input: '5\n10 20 30 40 50\n35', output: '-1' },
  ];

  if (difficulty === 'Hard') {
    hidden.push(
      { input: '10\n1 2 3 4 5 6 7 8 9 10\n10', output: '9' },
      { input: '10\n1 2 3 4 5 6 7 8 9 10\n1', output: '0' }
    );
  }

  return {
    test_cases: visible,
    hidden_test_cases: hidden,
  };
};

const buildContextualGenericCases = ({ title, description, difficulty }) => {
  const visible = [
    {
      input: '3\n1 2 3',
      output: '6',
      explanation: `Baseline sanity case for ${title || 'the problem'}.`,
    },
    {
      input: '5\n0 0 0 0 0',
      output: '0',
      explanation: 'All-zero edge case.',
    },
  ];

  if (difficulty === 'Medium' || difficulty === 'Hard') {
    visible.push({
      input: '4\n-5 2 -1 6',
      output: '2',
      explanation: 'Mixed-sign values to test robustness.',
    });
  }

  const hidden = buildHiddenFromVisible(visible, difficulty);

  return {
    test_cases: visible,
    hidden_test_cases: hidden,
  };
};

const buildHiddenFromVisible = (visible, difficulty) => {
  const hidden = visible.map((tc) => ({ input: tc.input, output: tc.output })).slice(0, 2);
  hidden.push(
    { input: '2\n1000000 -1000000', output: '0' },
    { input: '3\n1 1 1', output: '3' },
    { input: '4\n9 8 7 6', output: '30' }
  );

  if (difficulty === 'Hard') {
    hidden.push(
      { input: '6\n1 3 5 7 9 11', output: '36' },
      { input: '6\n-1 -2 -3 -4 -5 -6', output: '-21' }
    );
  }

  return hidden;
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
 * Explain a piece of code in plain language.
 * @param {string} code - User code
 * @param {string} language - Programming language
 * @returns {Promise<{success: boolean, text: string}>}
 */
export const explainCode = async (code, language) => {
  const prompt = `You are a senior software engineer mentoring a learner.

Language: ${language || 'unknown'}

Code:
\`\`\`
${code}
\`\`\`

Explain this code clearly in markdown with:
1. What the code does
2. How it works step by step
3. Important functions or logic blocks
4. Time and space complexity if it can be inferred
5. Any risks, edge cases, or improvements

Keep the explanation concise but useful.`;

  const generatedText = await callGemini(prompt, 'text/plain');

  if (!generatedText) {
    return {
      success: true,
      text: generateFallbackCodeExplanation(language),
    };
  }

  return {
    success: true,
    text: generatedText,
  };
};

/**
 * Analyze a learner's accepted solution and suggest an optimized approach.
 * @param {object} params
 * @returns {Promise<{success: boolean, analysis: object}>}
 */
export const analyzeSolutionComplexity = async ({
  problem,
  code,
  language,
  testResults = [],
}) => {
  const examples = Array.isArray(problem?.examples) ? problem.examples : [];
  const constraints = Array.isArray(problem?.constraints) ? problem.constraints : [];

  const prompt = `You are a senior algorithms mentor. Analyze this accepted coding solution with precision.

Return ONLY valid JSON in this exact shape:
{
  "currentTimeComplexity": "Big-O for the submitted code",
  "currentSpaceComplexity": "Big-O for the submitted code",
  "suggestedTimeComplexity": "Best practical Big-O for this problem",
  "suggestedSpaceComplexity": "Space Big-O for the suggested solution",
  "analysis": "Concise but complete explanation of what the current code does and why its complexity is what it is.",
  "improvements": [
    "Specific improvement 1",
    "Specific improvement 2"
  ],
  "optimizedApproach": "Explain the optimized algorithm and the key idea.",
  "optimizedSolution": "Complete optimized solution in the same language as the user's code.",
  "notes": [
    "Any important edge case or trade-off"
  ]
}

Rules:
1. Do not invent constraints. If the exact optimal complexity depends on missing constraints, say so in the analysis.
2. Keep the optimized solution complete and runnable in the same style as the submitted code.
3. Compare current complexity against the suggested complexity directly.
4. Mention both time complexity and space complexity.
5. Do not include markdown fences in JSON string fields.

Problem:
Title: ${problem?.title || 'Unknown'}
Difficulty: ${problem?.difficulty || 'Unknown'}
Description: ${problem?.description || 'No description provided'}
Constraints: ${constraints.join(', ') || 'None provided'}
Examples: ${JSON.stringify(examples.slice(0, 3))}
Recent passed test results: ${JSON.stringify(testResults.slice(0, 5))}

Language: ${language || 'unknown'}
Submitted code:
${code}`;

  const generatedText = await callGemini(prompt, 'text/plain');

  if (!generatedText) {
    return {
      success: false,
      error:
        lastGeminiError ||
        'Gemini did not return a response. Check GEMINI_API_KEY, network access, and optionally set GEMINI_MODEL=gemini-flash-latest in .env.',
    };
  }

  try {
    const parsed = parseJsonLikeResponse(generatedText);
    return {
      success: true,
      analysis: normalizeComplexityAnalysis(parsed, language),
    };
  } catch (error) {
    console.error('Failed to parse solution analysis response:', error.message);
    return {
      success: false,
      error: 'Gemini returned a response, but it was not valid JSON. Please try Analyse with AI again.',
    };
  }
};

/**
 * Analyze test cases to understand input/output format
 * @param {array} testCases - Array of test case objects
 * @param {array} examples - Array of example objects
 * @returns {string} - Analysis of I/O format
 */
const analyzeIOFormat = (testCases = [], examples = []) => {
  if (examples.length === 0 && testCases.length === 0) {
    return 'Format Unknown: Please provide examples or test cases';
  }

  const sample = examples.length > 0 ? examples[0] : testCases[0];
  const inputStr = sample.input || '';
  const outputStr = sample.output || '';

  let analysis = '';
  
  // Analyze input format
  if (inputStr.includes('\n')) {
    analysis += `- Input: Multiple lines (one value per line or multi-line input)\n`;
  } else if (inputStr.includes(' ')) {
    analysis += `- Input: Space-separated values on a single line\n`;
  } else if (inputStr.match(/^\d+$/)) {
    analysis += `- Input: Single integer\n`;
  } else {
    analysis += `- Input: String or custom format\n`;
  }

  // Analyze output format
  if (outputStr.includes('\n')) {
    analysis += `- Output: Multiple lines (list or formatted output)\n`;
  } else if (outputStr.match(/^\d+$/)) {
    analysis += `- Output: Single integer\n`;
  } else if (outputStr.match(/^(true|false|yes|no)$/i)) {
    analysis += `- Output: Boolean or yes/no\n`;
  } else if (outputStr.includes('[') && outputStr.includes(']')) {
    analysis += `- Output: Array or list format\n`;
  } else {
    analysis += `- Output: String or custom format\n`;
  }

  // Number of test cases for context
  analysis += `- Visible Test Cases: ${testCases.length.toString()}\n`;
  analysis += `- Sample Input: "${inputStr.substring(0, 50)}${inputStr.length > 50 ? '...' : ''}"\n`;
  analysis += `- Sample Output: "${outputStr.substring(0, 50)}${outputStr.length > 50 ? '...' : ''}"`;

  return analysis;
};

/**
 * Generate starter code templates for supported languages.
 * @param {object} problemData - Problem details and test case context
 * @returns {Promise<object>} - starter_code object keyed by language
 */
export const generateStarterCode = async (problemData) => {
  const {
    title,
    description,
    difficulty,
    constraints = [],
    examples = [],
    test_cases = [],
    languages = ['javascript', 'python', 'java', 'cpp'],
  } = problemData;

  // Analyze test cases to understand input/output format
  const inputOutputAnalysis = analyzeIOFormat(test_cases, examples);

  const prompt = `You are an expert coding interview instructor. Generate professional starter code templates that include proper I/O handling.

PROBLEM DETAILS:
Title: ${title}
Description: ${description}
Difficulty: ${difficulty || 'Medium'}
Constraints: ${constraints.length > 0 ? constraints.join(', ') : 'None specified'}

EXAMPLES & TEST CASES:
${examples.map((ex, i) => `Example ${i + 1}: Input: "${ex.input}" → Output: "${ex.output}"`).join('\n')}

First Visible Test Cases:
${test_cases.slice(0, 2).map((tc, i) => `Test ${i + 1}: Input: "${tc.input}" → Output: "${tc.output}"`).join('\n')}

INPUT/OUTPUT FORMAT ANALYSIS:
${inputOutputAnalysis}

Generate ONLY valid JSON in this exact shape:
{
  "starter_code": {
    "javascript": "complete starter code for this language",
    "python": "complete starter code for this language",
    "java": "complete starter code for this language",
    "cpp": "complete starter code for this language"
  }
}

CRITICAL REQUIREMENTS:
1. ONLY return the languages requested. Include all of: ${languages.join(', ')}
2. Each template MUST be a complete, compilable/runnable scaffold.
3. Include a main entry point that:
   - Reads input appropriately (stdin, function parameter, etc.)
   - Parses the input based on the format shown in examples
   - Calls a solve() function with parsed data
   - Outputs results in the exact format shown
4. The solve() function should have TODO comments for logic implementation
5. Include helper functions or parsing logic as scaffolds - DO NOT implement the solution logic
6. Make the templates realistic for coding interviews - they should handle the I/O properly
7. Language-specific details:
   - JavaScript: Use readline or process.stdin, export solve function
   - Python: Use input() and sys.stdin, define solve function
   - Java: Use Scanner for input, class Solution with main method
   - C++: Use cin for input, complete program with main function
8. Do NOT include the actual solution algorithm - only the scaffold

Generate professional, production-ready starter code that handles I/O correctly.`;

  const generatedText = await callGemini(prompt);
  if (!generatedText) {
    return generateFallbackStarterCode(languages);
  }

  try {
    const parsed = JSON.parse(generatedText);
    const generated = parsed?.starter_code;
    if (!generated || typeof generated !== 'object') {
      throw new Error('Invalid starter_code response');
    }

    const filtered = {};
    for (const lang of languages) {
      if (typeof generated[lang] === 'string' && generated[lang].trim()) {
        filtered[lang] = generated[lang];
      }
    }

    if (Object.keys(filtered).length === 0) {
      return generateFallbackStarterCode(languages);
    }

    return filtered;
  } catch (error) {
    console.error('Failed to parse starter code response:', error.message);
    return generateFallbackStarterCode(languages);
  }
};

const generateFallbackStarterCode = (languages = ['javascript', 'python', 'java', 'cpp']) => {
  const templates = {
    javascript: `function solve(input) {
  // TODO: parse input
  // TODO: implement logic
  return '';
}

module.exports = { solve };`,
    python: `def solve(input_data: str) -> str:
    # TODO: parse input_data
    # TODO: implement logic
    return ""`,
    java: `class Solution {
    public static String solve(String input) {
        // TODO: parse input
        // TODO: implement logic
        return "";
    }
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;

string solve(const string& input) {
    // TODO: parse input
    // TODO: implement logic
    return "";
}`,
  };

  const starter = {};
  for (const lang of languages) {
    if (templates[lang]) {
      starter[lang] = templates[lang];
    }
  }
  return starter;
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

const generateFallbackCodeExplanation = (language) => {
  return `# Code Explanation

## What It Does
This ${language || 'program'} processes the given input and produces output according to its implemented logic.

## How It Works
1. It defines the main logic in the submitted code.
2. It reads or receives input values.
3. It performs the required computation step by step.
4. It returns or prints the final result.

## Notes
- Review the control flow and data transformations carefully.
- Check edge cases, especially empty input, invalid values, and boundary conditions.
- If performance matters, inspect loops and nested operations to estimate time complexity.`;
};

const normalizeComplexityAnalysis = (analysis, language) => ({
  currentTimeComplexity: analysis?.currentTimeComplexity || 'Unable to infer confidently',
  currentSpaceComplexity: analysis?.currentSpaceComplexity || 'Unable to infer confidently',
  suggestedTimeComplexity: analysis?.suggestedTimeComplexity || 'Depends on the problem constraints',
  suggestedSpaceComplexity: analysis?.suggestedSpaceComplexity || 'Depends on the chosen data structures',
  analysis:
    analysis?.analysis ||
    'The submitted code passes the available tests. Review loops, recursion, and auxiliary data structures to confirm the exact complexity.',
  improvements: Array.isArray(analysis?.improvements) ? analysis.improvements : [],
  optimizedApproach:
    analysis?.optimizedApproach ||
    'Use the most direct algorithm that satisfies the constraints while avoiding unnecessary repeated work.',
  optimizedSolution:
    analysis?.optimizedSolution ||
    `No optimized ${language || 'code'} solution was returned by the AI service.`,
  notes: Array.isArray(analysis?.notes) ? analysis.notes : [],
});

const buildFallbackComplexityAnalysis = (language) =>
  normalizeComplexityAnalysis(
    {
      analysis:
        'The submitted code passed the selected tests, but Gemini was unavailable, so only a generic review could be generated.',
      improvements: [
        'Check nested loops and repeated scans for avoidable work.',
        'Use an appropriate data structure such as a hash map, set, heap, or two pointers when it reduces repeated computation.',
        'Validate edge cases from the constraints before final submission.',
      ],
      optimizedApproach:
        'Start from the brute-force idea, identify the repeated computation, then cache, index, sort, or use two pointers depending on the problem shape.',
      optimizedSolution:
        `Gemini did not return an optimized ${language || 'language'} solution. Please try Analyse with AI again.`,
      notes: ['Complexity could not be verified without an AI response.'],
    },
    language
  );

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
  explainCode,
  analyzeSolutionComplexity,
  generateStarterCode,
  generateCompleteProblemSpec,
  callGemini,
};

import { asyncHandler } from '../middleware/errorHandler.js';
import geminiService from '../services/geminiService.js';

/**
 * Generate test cases for a new problem
 */
export const generateTestCases = asyncHandler(async (req, res) => {
  const { title, description, difficulty, constraints } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      error: 'Title and description are required'
    });
  }

  console.log(`🤖 Generating test cases for: ${title}`);

  try {
    const testCases = await geminiService.generateTestCases({
      title,
      description,
      difficulty: difficulty || 'Medium',
      constraints: constraints || []
    });

    res.json({
      success: true,
      test_cases: testCases.test_cases || [],
      visible_test_cases: testCases.test_cases || [],
      hidden_test_cases: testCases.hidden_test_cases || [],
      message: `Generated ${testCases.test_cases?.length || 0} visible and ${testCases.hidden_test_cases?.length || 0} hidden test cases`
    });
  } catch (error) {
    console.error('Error generating test cases:', error);
    res.status(500).json({
      error: 'Failed to generate test cases',
      message: error.message
    });
  }
});

/**
 * Generate hints for a problem
 */
export const generateHints = asyncHandler(async (req, res) => {
  const { title, description, difficulty } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      error: 'Title and description are required'
    });
  }

  console.log(`🤖 Generating hints for: ${title}`);

  try {
    const hints = await geminiService.generateHints({
      title,
      description,
      difficulty: difficulty || 'Medium'
    });

    res.json({
      success: true,
      hints: hints || [],
      message: `Generated ${hints?.length || 0} hints`
    });
  } catch (error) {
    console.error('Error generating hints:', error);
    res.status(500).json({
      error: 'Failed to generate hints',
      message: error.message
    });
  }
});

/**
 * Generate solution explanation
 */
export const generateSolutionExplanation = asyncHandler(async (req, res) => {
  const { title, description, difficulty } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      error: 'Title and description are required'
    });
  }

  console.log(`🤖 Generating solution explanation for: ${title}`);

  try {
    const explanation = await geminiService.generateSolutionExplanation({
      title,
      description,
      difficulty: difficulty || 'Medium'
    });

    res.json({
      success: true,
      explanation: explanation || '',
      message: 'Solution explanation generated'
    });
  } catch (error) {
    console.error('Error generating explanation:', error);
    res.status(500).json({
      error: 'Failed to generate explanation',
      message: error.message
    });
  }
});

export default {
  generateTestCases,
  generateHints,
  generateSolutionExplanation
};

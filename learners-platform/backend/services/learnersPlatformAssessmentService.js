import { DEFAULT_TTL_SECONDS, getCache, setCache } from '../../../server/utils/redisCache.js';

const ASSESSMENT_CACHE_TTL = Number(
  process.env.LEARNERS_PLATFORM_ASSESSMENT_CACHE_TTL || Math.min(DEFAULT_TTL_SECONDS, 3600)
);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const buildAssessmentCacheKey = (topicSlug, problemIds) =>
  `learners-platform:assessment:${topicSlug}:${problemIds.join('-') || 'general'}`;

const sanitizeSolvedProblems = (solvedProblems = []) =>
  solvedProblems
    .filter((problem) => problem && problem.id && problem.title)
    .slice(0, 6)
    .map((problem) => ({
      id: String(problem.id),
      title: String(problem.title),
      difficulty: String(problem.difficulty || 'Unknown'),
      categories: Array.isArray(problem.categories) ? problem.categories.slice(0, 4) : [],
      solvedAt: problem.solvedAt || null,
      nextReviewAt: problem.nextReviewAt || null,
      reviewCount: Number(problem.reviewCount || 0),
    }));

const buildFocusAreas = (topic, solvedProblems) => {
  const allCategories = new Map();

  solvedProblems.forEach((problem) => {
    (problem.categories || []).forEach((category) => {
      allCategories.set(category, (allCategories.get(category) || 0) + 1);
    });
  });

  const categoryFocus = Array.from(allCategories.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  return categoryFocus.length > 0 ? categoryFocus : (topic.problemCategories || []).slice(0, 3);
};

const getSelectedProblems = (topic, solvedProblems) => {
  const dueProblems = solvedProblems
    .filter((problem) => !problem.nextReviewAt || new Date(problem.nextReviewAt).getTime() <= Date.now())
    .slice(0, 3);

  return (dueProblems.length > 0 ? dueProblems : solvedProblems).slice(0, 3).map((problem, index) => ({
    ...problem,
    focusArea: problem.categories?.[0] || topic.problemCategories?.[index] || topic.category,
  }));
};

const buildFallbackAssessment = (topic, solvedProblems) => {
  const focusAreas = buildFocusAreas(topic, solvedProblems);
  const selectedProblems = getSelectedProblems(topic, solvedProblems);

  const mcqs = selectedProblems.map((problem, index) => ({
    id: `${problem.id}-mcq`,
    type: 'mcq',
    title: `Pattern recall for ${problem.title}`,
    prompt: `Which approach best matches the main pattern behind "${problem.title}"?`,
    relatedProblemId: problem.id,
    focusArea: problem.focusArea,
    options: [
      `Use the core ${problem.focusArea || topic.category} pattern and optimize for one-pass reasoning`,
      'Sort first even when sorting is not required by the problem statement',
      'Ignore edge cases and rely on brute force because constraints are probably small',
      'Always prefer recursion even when an iterative pass is simpler and cheaper',
    ],
    correctOptionIndex: 0,
    explanation:
      `The strongest answer ties back to the ${problem.focusArea || topic.category} pattern you already practiced and keeps the solution aligned with the actual constraints.`,
  }));

  const interviewQuestions = selectedProblems.map((problem, index) => ({
    id: `${problem.id}-interview`,
    type: 'interview',
    title: `Interview walkthrough: ${problem.title}`,
    prompt: `Walk through how you would solve "${problem.title}" in an interview. Explain the brute-force idea, the better approach, key edge cases, and the final time/space complexity.`,
    relatedProblemId: problem.id,
    focusArea: focusAreas[index % focusAreas.length] || topic.category,
    answerGuide: [
      'Explain the pattern or data structure choice clearly.',
      'Mention edge cases and why they matter.',
      'State time and space complexity explicitly.',
    ],
  }));

  return {
    source: 'adaptive-fallback',
    focusAreas,
    mcqs,
    interviewQuestions,
  };
};

const parseGeminiAssessment = (text, fallbackAssessment) => {
  try {
    const parsed = JSON.parse(text);
    const mcqs = Array.isArray(parsed.mcqs)
      ? parsed.mcqs.slice(0, 4).map((mcq, index) => ({
          id: mcq.id || `mcq-${index + 1}`,
          type: 'mcq',
          title: mcq.title || `MCQ ${index + 1}`,
          prompt: mcq.prompt || mcq.question || '',
          relatedProblemId: mcq.relatedProblemId || fallbackAssessment.mcqs[index]?.relatedProblemId || null,
          focusArea: mcq.focusArea || fallbackAssessment.focusAreas[index % fallbackAssessment.focusAreas.length] || null,
          options: Array.isArray(mcq.options) ? mcq.options.slice(0, 4) : fallbackAssessment.mcqs[index]?.options || [],
          correctOptionIndex:
            Number.isInteger(mcq.correctOptionIndex) && mcq.correctOptionIndex >= 0 ? mcq.correctOptionIndex : 0,
          explanation: mcq.explanation || fallbackAssessment.mcqs[index]?.explanation || '',
        }))
      : fallbackAssessment.mcqs;

    const interviewQuestions = Array.isArray(parsed.interviewQuestions)
      ? parsed.interviewQuestions.slice(0, 3).map((question, index) => ({
          id: question.id || `interview-${index + 1}`,
          type: 'interview',
          title: question.title || `Interview question ${index + 1}`,
          prompt: question.prompt || question.question || '',
          relatedProblemId:
            question.relatedProblemId || fallbackAssessment.interviewQuestions[index]?.relatedProblemId || null,
          focusArea:
            question.focusArea || fallbackAssessment.focusAreas[index % fallbackAssessment.focusAreas.length] || null,
          answerGuide: Array.isArray(question.answerGuide)
            ? question.answerGuide.slice(0, 4)
            : fallbackAssessment.interviewQuestions[index]?.answerGuide || [],
        }))
      : fallbackAssessment.interviewQuestions;

    if (mcqs.length > 0 || interviewQuestions.length > 0) {
      return {
        source: 'gemini',
        focusAreas: Array.isArray(parsed.focusAreas)
          ? parsed.focusAreas.slice(0, 4)
          : fallbackAssessment.focusAreas,
        mcqs,
        interviewQuestions,
      };
    }
  } catch {}

  return fallbackAssessment;
};

const callGemini = async (prompt, responseMimeType = 'application/json') => {
  if (!GEMINI_API_KEY || !globalThis.fetch) {
    return null;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType,
        },
      }),
      signal:
        typeof AbortSignal !== 'undefined' && AbortSignal.timeout
          ? AbortSignal.timeout(15000)
          : undefined,
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || null;
};

const generateWithGemini = async (topic, solvedProblems, fallbackAssessment) => {
  const prompt = [
    'You are generating a topic assessment for a coding learner.',
    'Return valid JSON only.',
    'Required shape:',
    '{"focusAreas":["..."],"mcqs":[{"id":"...","title":"...","prompt":"...","options":["..."],"correctOptionIndex":0,"explanation":"...","relatedProblemId":"...","focusArea":"..."}],"interviewQuestions":[{"id":"...","title":"...","prompt":"...","answerGuide":["..."],"relatedProblemId":"...","focusArea":"..."}]}',
    `Topic: ${topic.title}`,
    `Topic category: ${topic.category}`,
    `Practice focus: ${topic.practiceFocus}`,
    `Solved problems: ${JSON.stringify(solvedProblems)}`,
    'Make 3-4 MCQs and 2-3 interview-style questions.',
    'MCQs should test concepts, tradeoffs, or common mistakes.',
    'Interview questions should sound like a real interviewer asking the candidate to reason aloud.',
  ].join('\n');

  const text = await callGemini(prompt);
  if (!text) {
    return fallbackAssessment;
  }

  return parseGeminiAssessment(text, fallbackAssessment);
};

const generateTopicAssessment = async (topic, solvedProblems = []) => {
  const sanitizedSolvedProblems = sanitizeSolvedProblems(solvedProblems);
  const cacheKey = buildAssessmentCacheKey(
    topic.slug,
    sanitizedSolvedProblems.map((problem) => problem.id)
  );

  const cached = await getCache(cacheKey);
  if (cached) {
    return {
      ...cached,
      cached: true,
      cacheKey,
    };
  }

  const fallbackAssessment = buildFallbackAssessment(topic, sanitizedSolvedProblems);
  let assessment = fallbackAssessment;

  try {
    assessment = await generateWithGemini(topic, sanitizedSolvedProblems, fallbackAssessment);
  } catch {
    assessment = fallbackAssessment;
  }

  const result = {
    ...assessment,
    cached: false,
    cacheKey,
    generatedAt: new Date().toISOString(),
    basedOnSolvedProblems: sanitizedSolvedProblems,
    dueProblemCount: sanitizedSolvedProblems.filter(
      (problem) => !problem.nextReviewAt || new Date(problem.nextReviewAt).getTime() <= Date.now()
    ).length,
    cacheTtlSeconds: ASSESSMENT_CACHE_TTL,
  };

  await setCache(
    cacheKey,
    {
      source: result.source,
      focusAreas: result.focusAreas,
      mcqs: result.mcqs,
      interviewQuestions: result.interviewQuestions,
      generatedAt: result.generatedAt,
      basedOnSolvedProblems: result.basedOnSolvedProblems,
      dueProblemCount: result.dueProblemCount,
      cacheTtlSeconds: result.cacheTtlSeconds,
    },
    ASSESSMENT_CACHE_TTL
  );

  return result;
};

const buildFallbackFeedback = ({ topic, assessment, responses }) => {
  const answeredMcqs = (assessment.mcqs || []).map((mcq) => {
    const selectedOptionIndex = responses.mcqAnswers?.[mcq.id];
    const isCorrect = selectedOptionIndex === mcq.correctOptionIndex;

    return {
      id: mcq.id,
      title: mcq.title,
      selectedOptionIndex,
      isCorrect,
      explanation: mcq.explanation,
    };
  });

  const interviewEntries = (assessment.interviewQuestions || []).map((question) => {
    const answer = (responses.interviewAnswers?.[question.id] || '').trim();
    const strengths = [];
    const improvements = [];

    if (answer.length > 220) {
      strengths.push('You gave enough detail to sound like you are thinking aloud instead of guessing.');
    } else {
      improvements.push('Add more structured detail so the interviewer can follow your reasoning.');
    }

    if (/time|space|complexity/i.test(answer)) {
      strengths.push('You mentioned complexity, which is important in interview-style explanations.');
    } else {
      improvements.push('Call out time and space complexity explicitly.');
    }

    if (/edge|case|null|empty|duplicate/i.test(answer)) {
      strengths.push('You brought up edge cases, which shows practical caution.');
    } else {
      improvements.push('Mention edge cases to make the answer feel production-ready.');
    }

    return {
      id: question.id,
      title: question.title,
      answer,
      strengths,
      improvements,
      rating: answer.length > 260 ? 'strong' : answer.length > 120 ? 'developing' : 'needs-work',
    };
  });

  const correctCount = answeredMcqs.filter((item) => item.isCorrect).length;
  const totalCount = answeredMcqs.length || 1;

  return {
    source: 'adaptive-fallback',
    summary: `You are building retention in ${topic.title}. You got ${correctCount}/${totalCount} MCQs correct and your interview-style responses show where to deepen structure and confidence.`,
    overallRating:
      correctCount / totalCount >= 0.75 ? 'strong' : correctCount / totalCount >= 0.4 ? 'developing' : 'needs-work',
    nextSteps: [
      `Revisit ${topic.title} with one short review session focused on ${assessment.focusAreas?.[0] || topic.category}.`,
      'Practice speaking through the solution structure before writing code.',
      'Review one previously solved problem and restate its complexity and edge cases from memory.',
    ],
    mcqFeedback: answeredMcqs,
    interviewFeedback: interviewEntries,
  };
};

const generateAssessmentFeedback = async ({ topic, assessment, responses }) => {
  const fallback = buildFallbackFeedback({ topic, assessment, responses });
  if (!GEMINI_API_KEY) {
    return fallback;
  }

  const prompt = [
    'You are a helpful technical interviewer giving feedback on a learner topic assessment.',
    'Return valid JSON only with shape:',
    '{"summary":"...","overallRating":"strong|developing|needs-work","nextSteps":["..."],"mcqFeedback":[{"id":"...","title":"...","selectedOptionIndex":0,"isCorrect":true,"explanation":"..."}],"interviewFeedback":[{"id":"...","title":"...","rating":"strong|developing|needs-work","strengths":["..."],"improvements":["..."]}]}',
    `Topic: ${topic.title}`,
    `Assessment: ${JSON.stringify(assessment)}`,
    `Responses: ${JSON.stringify(responses)}`,
    'Give concise, specific coaching. For interview answers, comment on structure, clarity, edge cases, and complexity communication.',
  ].join('\n');

  try {
    const text = await callGemini(prompt);
    if (!text) {
      return fallback;
    }

    const parsed = JSON.parse(text);
    return {
      source: 'gemini',
      summary: parsed.summary || fallback.summary,
      overallRating: parsed.overallRating || fallback.overallRating,
      nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps.slice(0, 4) : fallback.nextSteps,
      mcqFeedback: Array.isArray(parsed.mcqFeedback) ? parsed.mcqFeedback : fallback.mcqFeedback,
      interviewFeedback: Array.isArray(parsed.interviewFeedback)
        ? parsed.interviewFeedback
        : fallback.interviewFeedback,
    };
  } catch {
    return fallback;
  }
};

export { generateAssessmentFeedback, generateTopicAssessment };

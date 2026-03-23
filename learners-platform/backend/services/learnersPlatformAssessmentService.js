const { DEFAULT_TTL_SECONDS, getCache, setCache } = require('../../../server/utils/redisCache');

const ASSESSMENT_CACHE_TTL = Number(
  process.env.LEARNERS_PLATFORM_ASSESSMENT_CACHE_TTL || Math.min(DEFAULT_TTL_SECONDS, 3600)
);

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

const buildFallbackQuestions = (topic, solvedProblems) => {
  const focusAreas = buildFocusAreas(topic, solvedProblems);
  const dueProblems = solvedProblems
    .filter((problem) => !problem.nextReviewAt || new Date(problem.nextReviewAt).getTime() <= Date.now())
    .slice(0, 3);
  const selectedProblems = (dueProblems.length > 0 ? dueProblems : solvedProblems).slice(0, 3);

  const questions = selectedProblems.flatMap((problem, index) => {
    const firstCategory = problem.categories?.[0] || topic.problemCategories?.[0] || topic.category;

    return [
      {
        id: `${problem.id}-concept`,
        type: 'concept',
        title: `Explain the core pattern behind ${problem.title}`,
        prompt: `You solved "${problem.title}" earlier. Explain the main idea, why it works, and when you would choose this approach again.`,
        relatedProblemId: problem.id,
        focusArea: firstCategory,
      },
      {
        id: `${problem.id}-variation`,
        type: 'variation',
        title: `Handle a variation of ${problem.title}`,
        prompt: `If the constraints or input shape changed in "${problem.title}", how would you adapt your solution while keeping it efficient?`,
        relatedProblemId: problem.id,
        focusArea: firstCategory,
      },
    ];
  });

  if (questions.length >= 4) {
    return {
      source: 'adaptive-fallback',
      focusAreas,
      questions: questions.slice(0, 6),
    };
  }

  return {
    source: 'adaptive-fallback',
    focusAreas,
    questions: [
      {
        id: `${topic.slug}-recall`,
        type: 'recall',
        title: `Recall the topic fundamentals`,
        prompt: `Summarize the most important ideas from ${topic.title}, including one common mistake and one signal that tells you this topic is the right fit.`,
        relatedProblemId: selectedProblems[0]?.id || null,
        focusArea: focusAreas[0] || topic.category,
      },
      {
        id: `${topic.slug}-tradeoff`,
        type: 'tradeoff',
        title: `Talk through an implementation tradeoff`,
        prompt: `Pick one ${topic.title} problem you solved before. Compare your first instinct with the better approach, then explain the tradeoff in time and space complexity.`,
        relatedProblemId: selectedProblems[0]?.id || null,
        focusArea: focusAreas[1] || topic.category,
      },
      {
        id: `${topic.slug}-debug`,
        type: 'debug',
        title: `Debug a likely failure mode`,
        prompt: `What is a bug or edge case that often appears in ${topic.title} problems, and how would you catch it quickly during an interview?`,
        relatedProblemId: selectedProblems[1]?.id || selectedProblems[0]?.id || null,
        focusArea: focusAreas[2] || topic.category,
      },
      {
        id: `${topic.slug}-transfer`,
        type: 'transfer',
        title: `Transfer the pattern`,
        prompt: `Describe how the pattern from ${topic.title} could show up in a real product or backend/frontend task, not just in coding interviews.`,
        relatedProblemId: selectedProblems[2]?.id || selectedProblems[0]?.id || null,
        focusArea: focusAreas[0] || topic.category,
      },
    ],
  };
};

const parseGeminiResponse = (text, fallback) => {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
      return {
        source: 'gemini',
        focusAreas: Array.isArray(parsed.focusAreas) ? parsed.focusAreas.slice(0, 4) : fallback.focusAreas,
        questions: parsed.questions.slice(0, 6).map((question, index) => ({
          id: question.id || `gemini-${index + 1}`,
          type: question.type || 'reflection',
          title: question.title || `Assessment question ${index + 1}`,
          prompt: question.prompt || question.question || '',
          relatedProblemId: question.relatedProblemId || null,
          focusArea: question.focusArea || fallback.focusAreas[index % fallback.focusAreas.length] || null,
        })),
      };
    }
  } catch {}

  return fallback;
};

const generateWithGemini = async (topic, solvedProblems, fallbackAssessment) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || !globalThis.fetch) {
    return fallbackAssessment;
  }

  const prompt = [
    'You are generating short spaced-repetition assessment questions for a coding learner.',
    'Return valid JSON only with shape: {"focusAreas":["..."],"questions":[{"id":"...","type":"...","title":"...","prompt":"...","relatedProblemId":"...","focusArea":"..."}]}',
    `Topic: ${topic.title}`,
    `Topic category: ${topic.category}`,
    `Topic practice focus: ${topic.practiceFocus}`,
    `Solved problems: ${JSON.stringify(solvedProblems)}`,
    'Questions should help the learner not forget prior topics, mix recall and applied thinking, and stay concise.',
  ].join('\n');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          responseMimeType: 'application/json',
        },
      }),
      signal:
        typeof AbortSignal !== 'undefined' && AbortSignal.timeout
          ? AbortSignal.timeout(12000)
          : undefined,
    }
  );

  if (!response.ok) {
    return fallbackAssessment;
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
  if (!text) {
    return fallbackAssessment;
  }

  return parseGeminiResponse(text, fallbackAssessment);
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

  const fallbackAssessment = buildFallbackQuestions(topic, sanitizedSolvedProblems);
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
      questions: result.questions,
      generatedAt: result.generatedAt,
      basedOnSolvedProblems: result.basedOnSolvedProblems,
      dueProblemCount: result.dueProblemCount,
      cacheTtlSeconds: result.cacheTtlSeconds,
    },
    ASSESSMENT_CACHE_TTL
  );

  return result;
};

module.exports = {
  generateTopicAssessment,
};

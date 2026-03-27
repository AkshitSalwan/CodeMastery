const createDraft = (id, title, description, difficulty, duration, questions) => ({
  id,
  testName: title,
  title,
  description,
  duration: String(duration),
  passingScore: '70',
  testDifficulty: difficulty,
  selectedTopics: [...new Set(questions.map((question) => question.topic).filter(Boolean))],
  testType: 'online',
  questions,
  totalScore: questions.reduce((sum, question) => sum + (question.score || 0), 0),
  totalQuestions: questions.length,
  createdBy: 'Interviewer',
  createdAt: new Date().toISOString(),
  status: 'draft',
});

const toDraftQuestion = (problem, fallbackTopic) => ({
  id: problem.id,
  slug: problem.slug,
  title: problem.title,
  description: problem.description || '',
  topic: Array.isArray(problem.tags) && problem.tags.length > 0 ? problem.tags[0] : fallbackTopic,
  difficulty:
    problem.difficulty && typeof problem.difficulty === 'string'
      ? `${problem.difficulty.charAt(0).toUpperCase()}${problem.difficulty.slice(1)}`
      : 'Medium',
  score: problem.points || 100,
});

export const buildSeedDraftTests = (problems) => {
  if (!Array.isArray(problems) || problems.length === 0) {
    return [];
  }

  const bySlug = new Map(problems.map((problem) => [problem.slug, problem]));
  const pick = (slug) => bySlug.get(slug);

  const draftDefinitions = [
    {
      id: 'seed-binary-search-suite',
      title: 'Binary Search Screening',
      description: 'Interview-ready screening test focused on binary search, pair sums, and array basics.',
      difficulty: 'Easy',
      duration: 60,
      questions: [
        pick('search-in-sorted-array'),
        pick('pair-sum-target'),
      ].filter(Boolean).map((problem) => toDraftQuestion(problem, 'Arrays')),
    },
    {
      id: 'seed-structures-round',
      title: 'Data Structures Round',
      description: 'Balanced test on stacks, intervals, and tree traversal with relevant scoring.',
      difficulty: 'Medium',
      duration: 90,
      questions: [
        pick('valid-parentheses-sequence'),
        pick('merge-overlapping-intervals'),
        pick('level-order-binary-tree'),
      ].filter(Boolean).map((problem) => toDraftQuestion(problem, 'Data Structures')),
    },
  ];

  return draftDefinitions
    .filter((draft) => draft.questions.length > 0)
    .map((draft) =>
      createDraft(draft.id, draft.title, draft.description, draft.difficulty, draft.duration, draft.questions)
    );
};

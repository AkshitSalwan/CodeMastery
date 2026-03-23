export const getSolvedProblemsMap = (user) => user?.learningProgress?.solvedProblems || {};

export const getSolvedProblemsList = (user) =>
  Object.values(getSolvedProblemsMap(user)).sort((a, b) => {
    const aTime = new Date(a.lastSolvedAt || a.solvedAt || 0).getTime();
    const bTime = new Date(b.lastSolvedAt || b.solvedAt || 0).getTime();
    return bTime - aTime;
  });

export const getSolvedProblemsForTopic = (user, topic) => {
  if (!topic) {
    return [];
  }

  const topicCategories = new Set(topic.problemCategories || []);
  const tagCategories = new Set(topic.tags || []);

  return getSolvedProblemsList(user).filter((problem) =>
    (problem.categories || []).some(
      (category) => topicCategories.has(category) || tagCategories.has(category)
    )
  );
};

export const getDueSolvedProblemsForTopic = (user, topic) =>
  getSolvedProblemsForTopic(user, topic).filter((problem) => {
    if (!problem.nextReviewAt) {
      return true;
    }

    return new Date(problem.nextReviewAt).getTime() <= Date.now();
  });

export const getDueReviewTopics = (user, topics = []) =>
  topics
    .map((topic) => ({
      topic,
      dueProblems: getDueSolvedProblemsForTopic(user, topic),
    }))
    .filter((entry) => entry.dueProblems.length > 0)
    .sort((a, b) => b.dueProblems.length - a.dueProblems.length);

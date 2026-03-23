const buildUrl = (baseUrl, path = '', params = {}) => {
  const url = new URL(`${baseUrl}${path}`, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (!value || String(value).toLowerCase() === 'all') {
      return;
    }

    url.searchParams.set(key, value);
  });

  return url.toString();
};

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const getLearnersPlatformMeta = async (baseUrl) => {
  const response = await fetch(buildUrl(baseUrl, '/meta'));
  return handleResponse(response);
};

export const getLearnersPlatformTopics = async (baseUrl, params = {}) => {
  const response = await fetch(buildUrl(baseUrl, '/topics', params));
  return handleResponse(response);
};

export const getFeaturedLearnersPlatformTopics = async (baseUrl) => {
  const response = await fetch(buildUrl(baseUrl, '/topics/featured'));
  return handleResponse(response);
};

export const getLearnersPlatformTopic = async (baseUrl, slug) => {
  const response = await fetch(buildUrl(baseUrl, `/topics/${slug}`));
  return handleResponse(response);
};

export const getLearnersPlatformTopicVideos = async (baseUrl, slug) => {
  const response = await fetch(buildUrl(baseUrl, `/topics/${slug}/videos`));
  return handleResponse(response);
};

export const getLearnersPlatformTopicAssessment = async (baseUrl, slug, solvedProblems = []) => {
  const response = await fetch(buildUrl(baseUrl, `/topics/${slug}/assessment`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ solvedProblems }),
  });

  return handleResponse(response);
};

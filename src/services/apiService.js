/**
 * API Service for database operations
 * All user data should go through these endpoints instead of localStorage
 */

const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:4000/api'
  : '/api';

export const apiService = {
  // Get auth token from localStorage
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth-token');
  },
  
  // Set auth token in localStorage
  setToken: (token) => {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem('auth-token', token);
    } else {
      localStorage.removeItem('auth-token');
    }
  },

  // Make authenticated request with token
  fetchWithAuth: async (endpoint, options = {}) => {
    const token = apiService.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers
    });

    const parseResponseBody = async () => {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          return await response.json();
        } catch {
          return null;
        }
      }

      try {
        const text = await response.text();
        return text ? { error: text } : null;
      } catch {
        return null;
      }
    };

    if (!response.ok) {
      if (response.status === 401) {
        apiService.setToken(null);
        throw new Error('Unauthorized - please login again');
      }
      const errorData = await parseResponseBody();
      const message = errorData?.error || errorData?.message || `API Error: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    const data = await parseResponseBody();
    return data ?? {};
  },

  // Questions API
  questions: {
    create: async (question) => 
      apiService.fetchWithAuth('/questions', { 
        method: 'POST', 
        body: JSON.stringify(question) 
      }),
    
    getAll: async () => 
      apiService.fetchWithAuth('/questions'),
    
    get: async (id) => 
      apiService.fetchWithAuth(`/questions/${id}`),
    
    update: async (id, question) => 
      apiService.fetchWithAuth(`/questions/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(question) 
      }),
    
    delete: async (id) => 
      apiService.fetchWithAuth(`/questions/${id}`, { method: 'DELETE' })
  },

  // Contests API
  contests: {
    create: async (contest) => 
      apiService.fetchWithAuth('/contests', { 
        method: 'POST', 
        body: JSON.stringify(contest) 
      }),
    
    getAll: async () => 
      apiService.fetchWithAuth('/contests'),
    
    get: async (id) => 
      apiService.fetchWithAuth(`/contests/${id}`),

    getMine: async () =>
      apiService.fetchWithAuth('/contests/mine'),
    
    update: async (id, contest) => 
      apiService.fetchWithAuth(`/contests/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(contest) 
      }),
    
    delete: async (id) => 
      apiService.fetchWithAuth(`/contests/${id}`, { method: 'DELETE' }),

    register: async (id) =>
      apiService.fetchWithAuth(`/contests/${id}/register`, { method: 'POST' }),

    join: async (id) =>
      apiService.fetchWithAuth(`/contests/${id}/join`, { method: 'POST' }),

    leaderboard: async (id) =>
      apiService.fetchWithAuth(`/contests/${id}/leaderboard`),

    participants: async (id) =>
      apiService.fetchWithAuth(`/contests/${id}/participants`),

    submissions: async (contestId) =>
      apiService.fetchWithAuth(`/contests/${contestId}/submissions`),

    submitProblem: async (contestId, problemId, payload) =>
      apiService.fetchWithAuth(`/contests/${contestId}/problems/${problemId}/submit`, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
  },

  // Tests API
  tests: {
    create: async (test) => 
      apiService.fetchWithAuth('/tests', { 
        method: 'POST', 
        body: JSON.stringify(test) 
      }),
    
    getAll: async () => 
      apiService.fetchWithAuth('/tests'),
    
    get: async (id) => 
      apiService.fetchWithAuth(`/tests/${id}`),
    
    update: async (id, test) => 
      apiService.fetchWithAuth(`/tests/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(test) 
      }),
    
    delete: async (id) => 
      apiService.fetchWithAuth(`/tests/${id}`, { method: 'DELETE' })
  },

  // Activities API
  activities: {
    log: async (activity) => 
      apiService.fetchWithAuth('/activities', { 
        method: 'POST', 
        body: JSON.stringify(activity) 
      }),
    
    getRecent: async (limit = 10) => 
      apiService.fetchWithAuth(`/activities?limit=${limit}`)
  }
};

export default apiService;

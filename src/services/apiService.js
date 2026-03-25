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

    if (!response.ok) {
      if (response.status === 401) {
        apiService.setToken(null);
        throw new Error('Unauthorized - please login again');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }

    return response.json();
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
    
    update: async (id, contest) => 
      apiService.fetchWithAuth(`/contests/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(contest) 
      }),
    
    delete: async (id) => 
      apiService.fetchWithAuth(`/contests/${id}`, { method: 'DELETE' })
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

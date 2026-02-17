import axios from 'axios';

/**
 * API_URL Logic:
 * In development (localhost or common cloud IDEs), we use the local API.
 * If the PROD_API_URL is set, we use it for production.
 */
const PROD_API_URL = 'https://skyreach.onrender.com/api/v1'; 
const DEV_API_URL = 'http://localhost:3000/api/v1';

// Environment detection
const isLocalhost = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1';

// Treat as production if not on localhost
const isProduction = !isLocalhost;

const API_URL = isProduction ? PROD_API_URL : DEV_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Mock Storage Helpers for UI fallback
const getMockData = (key: string) => JSON.parse(localStorage.getItem(`mock_${key}`) || '[]');

// Interceptor for Auth and Workspace Headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const workspaceId = localStorage.getItem('workspaceId');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (workspaceId) config.headers['x-workspace-id'] = workspaceId;
  
  // Ensure content-type is always set for mutations
  if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

// The Interceptor: Handles Network Errors and provides "Demo Mode" fallback
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isNetworkError = !error.response && error.code !== 'ECONNABORTED';
    
    if (isNetworkError) {
      const { method, url } = error.config || {};
      
      // If we're not in a strict production environment, we allow demo mode fallback
      if (!isProduction) {
        console.warn(`Backend server unreachable at ${API_URL}. Falling back to Demo Mode.`);
        
        // Simulating Auth for UI Preview
        if (url?.includes('/auth/login') || url?.includes('/auth/register')) {
          return {
            data: {
              token: 'demo-token-' + Date.now(),
              workspace: { id: 'w1', name: 'Demo Workspace' },
              user: { id: 'u1', email: 'demo@skyreach.ai', firstName: 'Demo', lastName: 'User' }
            }
          };
        }

        // Generic mock data for GET requests
        if (method === 'get') {
          if (url?.includes('/workspaces')) return { data: [{ id: 'w1', name: 'Demo Workspace' }] };
          return { data: getMockData(url?.split('/').pop() || 'data') };
        }
      } else {
        console.error(`CRITICAL: Backend server unreachable at ${API_URL}`);
      }
      
      return Promise.reject({
        ...error,
        message: isProduction 
          ? 'Our servers are currently undergoing maintenance. Please try again shortly.' 
          : 'Backend Offline. Please ensure your local server is running.'
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
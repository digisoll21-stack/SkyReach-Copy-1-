
import axios from 'axios';

/**
 * SkyReach Enterprise API Client
 * Logic hardened for production: Simulator only active in non-production hostnames.
 */
const getBaseURL = () => {
  // 1. Check for explicitly defined environment variable (Enterprise standard)
  let envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Remove trailing slash
    envUrl = envUrl.replace(/\/$/, '');

    // If the user accidentally included /api/v1 or more (like /health), 
    // we normalize it by stripping everything after /api/v1
    const apiPrefixIdx = envUrl.indexOf('/api/v1');
    if (apiPrefixIdx !== -1) {
      envUrl = envUrl.substring(0, apiPrefixIdx + 7);
    } else {
      // Otherwise, ensure it ends with /api/v1
      envUrl = `${envUrl}/api/v1`;
    }
    return envUrl;
  }

  // 2. Fallback for server-side-pre-rendering if needed
  if (typeof window === 'undefined') return 'http://localhost:3000/api/v1';

  // 3. Smart local/network resolution
  const host = window.location.hostname;
  return `${window.location.protocol}//${host}:3000/api/v1`;
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const workspaceId = localStorage.getItem('workspaceId');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (workspaceId) config.headers['x-workspace-id'] = workspaceId;
  return config;
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const host = window.location.hostname;
    const isProductionHost = host === 'skyreach.onrender.com' || host.includes('vercel.app');

    // We consider "Local" to be anything that ISN'T production. 
    // This allows network IPs to be treated as local dev environments.
    const isLocalOrNetwork = !isProductionHost;

    // CRITICAL: Disable simulation in production AND local/network dev to avoid masking real errors
    // Only enable simulator if explicitly forced (logic removed for stability)
    if (false) {
      // Simulator code removed/disabled to prevent interference
    }

    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '#/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;

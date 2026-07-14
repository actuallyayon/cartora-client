import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { clientEnv } from '@/config/env';

/**
 * Shared Axios instance. `withCredentials` lets the browser send/receive the
 * HTTP-only auth cookies issued by the API.
 */
// No default Content-Type: axios negotiates per request (JSON for objects,
// multipart/form-data with boundary for FormData uploads).
export const api = axios.create({
  baseURL: clientEnv.apiUrl,
  withCredentials: true,
});

// Endpoints whose own 401 is meaningful and must NOT trigger a refresh attempt.
const NO_REFRESH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

/**
 * Silent token refresh: when the short-lived access token expires, a request
 * gets a 401. We call /auth/refresh once (using the refresh cookie) and replay
 * the original request. A module-level promise de-duplicates concurrent refreshes.
 */
let refreshPromise: Promise<void> | null = null;

const refreshTokens = (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${clientEnv.apiUrl}/auth/refresh`, {}, { withCredentials: true })
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';

    const shouldRefresh =
      status === 401 &&
      original &&
      !original._retried &&
      !NO_REFRESH_PATHS.some((path) => url.includes(path));

    if (shouldRefresh) {
      original._retried = true;
      try {
        await refreshTokens();
        return api(original);
      } catch {
        // Refresh failed — the user's session is dead. Force them out.
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:logout'));
        }
      }
    }

    return Promise.reject(error);
  },
);

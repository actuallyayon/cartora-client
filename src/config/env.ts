/**
 * Client-side environment access. Only `NEXT_PUBLIC_*` values are available in
 * the browser. Centralizing them here avoids scattering `process.env` reads and
 * gives us one place to validate/default.
 */
// Always use relative URL so Next.js proxies to the backend (fixes third-party cookie blocking)
const apiUrl = '/api/v1';

export const clientEnv = {
  apiUrl,
} as const;

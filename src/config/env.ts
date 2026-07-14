/**
 * Client-side environment access. Only `NEXT_PUBLIC_*` values are available in
 * the browser. Centralizing them here avoids scattering `process.env` reads and
 * gives us one place to validate/default.
 */
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export const clientEnv = {
  apiUrl,
} as const;

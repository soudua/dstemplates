// Central place for API base URL.
//
// - Local dev: leave VITE_API_URL unset. Vite's proxy (vite.config.ts)
//   forwards /api/* to http://localhost:3001.
// - Production (split deploy): set VITE_API_URL to your backend's
//   public URL, e.g. https://api.dstemplate.co
// - Production (single-service deploy, Express serves the built
//   frontend): leave VITE_API_URL unset — /api/* is same-origin.

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiUrl = (path: string) => `${API_BASE_URL}${path}`;

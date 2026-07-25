import axios from 'axios'

/*
  Axios instance for the Laravel API.
  In dev, requests to /api and /storage are proxied to http://localhost:8000
  (see vite.config.js). In production set VITE_API_URL to the backend origin.
*/
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    Accept: 'application/json',
  },
  timeout: 15000,
})

/**
 * Resolve a stored media path into an absolute URL.
 * Passes through absolute URLs untouched.
 */
export function mediaUrl(path) {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  const base = import.meta.env.VITE_API_URL || ''
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`
}

export default api

/**
 * API client configuration and utilities.
 * Sets up an Axios instance with interceptors for debugging and error handling.
 * Includes authentication handling and common API endpoints.
 * 
 * Features:
 * - Preconfigured Axios instance
 * - Request/response logging
 * - Error handling with auth state reset
 * - Type-safe API functions
 * 
 * @example
 * ```tsx
 * // Using the API client
 * const user = await getMe()
 * 
 * // Direct API calls
 * const response = await api.get('/api/tickets')
 * 
 * // Error handling
 * try {
 *   await api.post('/api/tickets', newTicket)
 * } catch (err) {
 *   // 401 errors automatically reset auth state
 *   console.error(err)
 * }
 * ```
 */

import { User, useAuthStore } from '../stores/auth'
import axios, { AxiosError } from 'axios'

/** Base URL for API requests */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Preconfigured Axios instance for API requests
 * Includes credentials and JSON content type by default
 * 
 * @remarks
 * This instance is configured with:
 * - Base URL from environment or localhost fallback
 * - Credentials included for auth
 * - JSON content type header
 * - Request/response interceptors for logging
 * - Error handling for 401 unauthorized
 */
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Request interceptor for logging and debugging
 * Logs all outgoing requests in development
 * 
 * @remarks
 * Logs the following request details:
 * - HTTP method
 * - URL
 * - Request data
 * - Headers
 */
api.interceptors.request.use(
  config => {
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers
    })
    return config
  },
  error => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * Response interceptor for error handling
 * Handles 401 errors by resetting auth state
 * Logs all responses in development
 * 
 * @remarks
 * - Logs successful response data and status
 * - On 401, calls auth store's resetState
 * - Logs detailed error information
 * - Maintains type safety with AxiosError
 */
api.interceptors.response.use(
  response => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    })
    return response
  },
  (error: AxiosError) => {
    console.error('API Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    })
    
    if (error.response?.status === 401) {
      // Clear auth state on unauthorized
      const resetState = useAuthStore.getState().resetState
      resetState()
    }
    return Promise.reject(error)
  }
)

/**
 * Get the current user's profile
 * Makes a GET request to /api/users/me to fetch or create local user record
 * 
 * @returns Promise resolving to the user object
 * @throws {AxiosError} On API error or unauthorized
 * 
 * @remarks
 * - Called after successful ORY authentication
 * - Creates local user record if none exists
 * - Returns existing user data if found
 * - Throws error if unauthorized or API fails
 */
export async function getMe(): Promise<User> {
  const response = await api.get('/api/users/me')
  return response.data
} 
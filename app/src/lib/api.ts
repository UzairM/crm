import { User } from '../stores/auth'
import axios, { AxiosError } from 'axios'
import { useAuthStore } from '../stores/auth'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor for debugging
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

// Add response interceptor for error handling
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

export async function getMe(): Promise<User> {
  const response = await api.get('/api/users/me')
  return response.data
} 
import { User } from '../stores/auth'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export async function getMe(): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/users/me`, {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user data')
  }

  return response.json()
} 
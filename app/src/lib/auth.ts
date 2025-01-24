import { ory } from './ory'
import type { Session } from '@ory/client'

interface OryError {
  response?: {
    status?: number
    data?: {
      error?: {
        message?: string
      }
    }
  }
}

export async function requireAuth(): Promise<Session> {
  try {
    const { data: session } = await ory.toSession()
    
    if (!session) {
      throw new Error('No session found')
    }
    
    return session
  } catch (error) {
    const oryError = error as OryError
    if (oryError.response?.status === 401) {
      window.location.href = '/login'
      return Promise.reject('Not authenticated')
    }
    throw error
  }
}

export async function checkAuth(): Promise<Session | null> {
  try {
    const { data: session } = await ory.toSession()
    return session
  } catch (error) {
    const oryError = error as OryError
    if (oryError.response?.status === 401) {
      return null
    }
    throw error
  }
} 
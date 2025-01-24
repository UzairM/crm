import { redirect } from '@remix-run/node'
import { ory } from '../lib/ory'
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

export async function requireAuth(request: Request): Promise<Session> {
  try {
    const cookie = request.headers.get('cookie') || undefined
    const xSessionToken = cookie?.split('ory_session_token=')[1]?.split(';')[0]
    
    const { data: session } = await ory.toSession({
      cookie,
      xSessionToken,
    })
    
    if (!session) {
      throw new Error('No session found')
    }
    
    return session
  } catch (error) {
    const oryError = error as OryError
    if (oryError.response?.status === 401) {
      throw redirect('/login')
    }
    throw error
  }
}

export async function checkAuth(request: Request): Promise<Session | null> {
  try {
    const cookie = request.headers.get('cookie') || undefined
    const xSessionToken = cookie?.split('ory_session_token=')[1]?.split(';')[0]
    
    const { data: session } = await ory.toSession({
      cookie,
      xSessionToken,
    })
    return session
  } catch (error) {
    const oryError = error as OryError
    if (oryError.response?.status === 401) {
      return null
    }
    throw error
  }
} 
import { createContext, useContext } from 'react'

type JsonSession = {
  identity?: {
    id?: string
    traits?: {
      email?: string
    }
  }
}

interface SessionContextType {
  session: JsonSession | null
  isLoading: boolean
}

export const SessionContext = createContext<SessionContextType>({
  session: null,
  isLoading: true,
})

export function useSession() {
  return useContext(SessionContext)
}

export function useIsAuthenticated() {
  const { session, isLoading } = useSession()
  return {
    isAuthenticated: !!session?.identity?.id,
    isLoading,
  }
} 
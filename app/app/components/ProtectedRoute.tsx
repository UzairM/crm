import { Navigate, useLocation } from '@remix-run/react'
import { useAuthStore } from '../stores/auth'
import { useUIStore } from '../stores/ui'
import { useEffect, useState } from 'react'
import { ory } from '../lib/ory'
import { LoadingSpinner } from './LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = useAuthStore((state) => state.session)
  const setLoading = useUIStore((state) => state.setLoading)
  const isLoading = useUIStore((state) => state.isLoading)
  const location = useLocation()
  const [hasValidCookie, setHasValidCookie] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    async function checkSession() {
      try {
        setLoading(true)
        // Check if we have a session cookie
        const cookie = document.cookie
        if (!cookie?.includes('ory_session_token')) {
          setHasValidCookie(false)
          setShouldRedirect(true)
          setLoading(false)
          return
        }

        // Verify the session with ORY
        await ory.toSession()
        setHasValidCookie(true)
        setShouldRedirect(false)
      } catch (error) {
        // Session is invalid
        setHasValidCookie(false)
        setShouldRedirect(true)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [setLoading])

  if (isLoading) {
    return <LoadingSpinner />
  }

  // If we have a valid cookie but no session in store, let the page load
  // The loader will handle setting the session in the store
  if (hasValidCookie) {
    return <>{children}</>
  }

  // Only redirect after we've checked the session and confirmed we should
  if (shouldRedirect && !session) {
    return <Navigate to="/login" state={{ from: location.pathname }} />
  }

  // Show loading state while we check the session
  if (!hasValidCookie && !shouldRedirect) {
    return <LoadingSpinner />
  }

  return <>{children}</>
} 
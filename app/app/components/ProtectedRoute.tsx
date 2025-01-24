import { useLocation, useNavigate } from '@remix-run/react'
import { useState, useEffect } from 'react'
import { ory } from '../lib/ory'
import { LoadingSpinner } from './LoadingSpinner'
import { useAuthStore } from '../stores/auth'
import { useHydrated } from '../hooks/useHydrated'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHydrated = useHydrated()
  const [isChecking, setIsChecking] = useState(true)
  const session = useAuthStore((state) => state.session)
  const setSession = useAuthStore((state) => state.setSession)
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    let mounted = true

    async function checkSession() {
      if (!isHydrated) return
      
      console.log('ProtectedRoute: Starting session check')
      try {
        const { data: newSession } = await ory.toSession()
        console.log('ProtectedRoute: Session valid', newSession)

        if (!mounted) return

        setSession(newSession)
        if (newSession.identity) {
          const traits = newSession.identity.traits as { email: string }
          setUser({
            id: newSession.identity.id,
            email: traits.email,
            role: 'None',
            fullName: null,
            isActive: true,
          })
          console.log('ProtectedRoute: Set user with email:', traits.email)
        }
      } catch (error) {
        console.error('ProtectedRoute: Session invalid', error)
        if (mounted) {
          setSession(null)
          setUser(null)
          navigate(`/login?return_to=${encodeURIComponent(location.pathname)}`, { replace: true })
        }
      } finally {
        if (mounted) {
          console.log('ProtectedRoute: Check complete')
          setIsChecking(false)
        }
      }
    }

    checkSession()

    return () => {
      mounted = false
    }
  }, [isHydrated, location.pathname, setSession, setUser, navigate])

  // During SSR, render children
  if (!isHydrated) {
    return <>{children}</>
  }

  if (isChecking) {
    console.log('ProtectedRoute: Showing loading spinner')
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!session) {
    console.log('ProtectedRoute: No session, redirecting to login')
    navigate(`/login?return_to=${encodeURIComponent(location.pathname)}`, { replace: true })
    return null
  }

  console.log('ProtectedRoute: Rendering protected content')
  return <>{children}</>
} 
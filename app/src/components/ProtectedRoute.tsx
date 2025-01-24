import { useLocation, useNavigate } from 'react-router-dom'
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
  const setUser = useAuthStore((state) => state.setUser)
  const setSession = useAuthStore((state) => state.setSession)

  useEffect(() => {
    let mounted = true

    async function checkSession() {
      if (!isHydrated) return
      
      try {
        const { data } = await ory.toSession()

        if (!mounted) return

        if (data.identity) {
          const traits = data.identity.traits as { email: string }
          setUser({
            id: data.identity.id,
            email: traits.email,
            role: 'None',
            fullName: null,
            isActive: true,
          })
          setSession(data)
        } else {
          if (mounted) {
            setSession(null)
            setUser(null)
            navigate(`/login?return_to=${encodeURIComponent(location.pathname)}`, { replace: true })
          }
        }
      } catch (error) {
        if (mounted) {
          setSession(null)
          setUser(null)
          navigate(`/login?return_to=${encodeURIComponent(location.pathname)}`, { replace: true })
        }
      } finally {
        if (mounted) {
          setIsChecking(false)
        }
      }
    }

    checkSession()

    return () => {
      mounted = false
    }
  }, [isHydrated, location.pathname, setUser, setSession, navigate])

  if (isChecking) {
    return <LoadingSpinner />
  }

  return <>{children}</>
} 

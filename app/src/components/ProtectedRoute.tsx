import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { ory } from '../lib/ory'
import { LoadingSpinner } from './LoadingSpinner'
import { useAuthStore } from '../stores/auth'
import { useHydrated } from '../hooks/useHydrated'
import { getMe } from '../lib/api'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHydrated = useHydrated()
  const [isChecking, setIsChecking] = useState(true)
  const setUser = useAuthStore((state) => state.setUser)
  const setSession = useAuthStore((state) => state.setSession)
  const session = useAuthStore((state) => state.session)
  const user = useAuthStore((state) => state.user)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    async function checkSession() {
      if (!mountedRef.current) return

      if (!isHydrated) {
        if (mountedRef.current) {
          setIsChecking(false)
        }
        return
      }
      
      // If we have both session and user data
      if (session?.active && user) {
        // Check if user has required role
        if (allowedRoles && !allowedRoles.includes(user.role)) {
          if (mountedRef.current) {
            navigate('/dashboard', { replace: true })
          }
          return
        }

        if (mountedRef.current) {
          setIsChecking(false)
        }
        return
      }

      try {
        // Check ORY session
        const { data } = await ory.toSession()

        if (!mountedRef.current) return

        if (data.active) {
          setSession(data)
          
          try {
            const userData = await getMe()
            if (!mountedRef.current) return

            // Check if user has required role
            if (allowedRoles && !allowedRoles.includes(userData.role)) {
              navigate('/dashboard', { replace: true })
              return
            }

            setUser(userData)
          } catch (error) {
            console.error('Failed to fetch user data:', error)
            if (mountedRef.current) {
              setSession(null)
              setUser(null)
              navigate(`/login?return_to=${encodeURIComponent(location.pathname)}`, { replace: true })
            }
          }
        } else {
          if (mountedRef.current) {
            setSession(null)
            setUser(null)
            navigate(`/login?return_to=${encodeURIComponent(location.pathname)}`, { replace: true })
          }
        }
      } catch (error) {
        console.error('Session check failed:', error)
        if (mountedRef.current) {
          setSession(null)
          setUser(null)
          navigate(`/login?return_to=${encodeURIComponent(location.pathname)}`, { replace: true })
        }
      } finally {
        if (mountedRef.current) {
          setIsChecking(false)
        }
      }
    }

    checkSession()

    return () => {
      mountedRef.current = false
    }
  }, [isHydrated, location.pathname, setUser, setSession, navigate, session, user, allowedRoles])

  if (!isHydrated || isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return <>{children}</>
} 

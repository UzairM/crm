/**
 * Protected route component that handles authentication and role-based access control.
 * Verifies user session and role permissions before rendering child components.
 * Redirects to login if session is invalid or unauthorized.
 * 
 * @component
 * @example
 * ```tsx
 * <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
 *   <DashboardPage />
 * </ProtectedRoute>
 * ```
 */

import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { ory } from '../lib/ory'
import { LoadingSpinner } from './LoadingSpinner'
import { useAuthStore } from '../stores/auth'
import { useHydrated } from '../hooks/useHydrated'
import { getMe } from '../lib/api'

/**
 * Props for the ProtectedRoute component
 * @interface
 */
interface ProtectedRouteProps {
  /** Child components to render when route is accessible */
  children: React.ReactNode;
  /** List of roles allowed to access this route */
  allowedRoles?: string[];
}

/**
 * Protected route wrapper component
 * Handles authentication verification and role-based access control
 * Shows loading state during checks and redirects if unauthorized
 */
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
  const renderCount = useRef(0)

  console.log('ProtectedRoute Render:', {
    renderCount: ++renderCount.current,
    isHydrated,
    isChecking,
    hasUser: !!user,
    hasSession: !!session,
    pathname: location.pathname,
    userEmail: user?.email,
    sessionActive: session?.active,
    allowedRoles
  })

  useEffect(() => {
    async function checkSession() {
      if (!mountedRef.current) return

      console.log('ProtectedRoute checkSession Start:', {
        mounted: mountedRef.current,
        isHydrated,
        isChecking,
        hasUser: !!user,
        hasSession: !!session,
        userEmail: user?.email,
        sessionActive: session?.active
      })

      if (!isHydrated) {
        console.log('Not hydrated yet, returning early')
        return // Don't set isChecking to false here
      }
      
      if (session && user) {
        // Check if user has required role
        if (allowedRoles && !allowedRoles.includes(user.role)) {
          console.log('User does not have required role, redirecting')
          if (mountedRef.current) {
            navigate('/dashboard', { replace: true })
          }
          return
        }

        console.log('Already have session and user, returning early', {
          userEmail: user.email,
          sessionActive: session.active,
          userRole: user.role,
          allowedRoles
        })
        if (mountedRef.current) {
          setIsChecking(false)
        }
        return
      }

      try {
        console.log('Checking ORY session...')
        const { data } = await ory.toSession()
        
        if (!mountedRef.current) {
          console.log('Component unmounted during ORY check')
          return
        }

        if (data.identity) {
          console.log('Got ORY identity, setting session', data)
          setSession(data)
          
          try {
            console.log('Fetching user data...')
            const userData = await getMe()
            if (!mountedRef.current) {
              console.log('Component unmounted during user fetch')
              return
            }

            // Check if user has required role
            if (allowedRoles && !allowedRoles.includes(userData.role)) {
              console.log('User does not have required role, redirecting')
              navigate('/dashboard', { replace: true })
              return
            }

            console.log('Got user data, setting user', userData)
            setUser(userData)
            setIsChecking(false)
          } catch (error) {
            console.error('Failed to fetch user data:', error)
            if (mountedRef.current) {
              setSession(null)
              setUser(null)
              navigate(`/login?return_to=${encodeURIComponent(location.pathname)}`, { replace: true })
            }
          }
        } else {
          console.log('No identity in session, redirecting to login')
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
      }
    }

    checkSession()

    return () => {
      console.log('ProtectedRoute cleanup')
      mountedRef.current = false
    }
  }, [isHydrated, location.pathname, navigate, session, setSession, setUser, user, allowedRoles, isChecking])

  if (!isHydrated || isChecking) {
    console.log('Showing loading spinner:', { isHydrated, isChecking })
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  console.log('Rendering children, final state:', {
    renderCount: renderCount.current,
    isHydrated,
    isChecking,
    hasUser: !!user,
    hasSession: !!session,
    userRole: user?.role,
    allowedRoles
  })
  return <>{children}</>
} 

/**
 * A route protection component that checks both authentication and role-based access.
 * Redirects to dashboard if user doesn't have the required role.
 * Wraps ProtectedRoute to ensure authentication before checking roles.
 * 
 * @component
 * @example
 * ```tsx
 * <RoleProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
 *   <ManagerDashboard />
 * </RoleProtectedRoute>
 * ```
 */

import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { ProtectedRoute } from './ProtectedRoute'

/**
 * Props for the RoleProtectedRoute component
 * @interface
 */
interface RoleProtectedRouteProps {
  /** The child components to render if role check passes */
  children: React.ReactNode
  /** List of roles that are allowed to access this route */
  allowedRoles: string[]
}

export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const user = useAuthStore((state) => state.user)

  return (
    <ProtectedRoute>
      {user && allowedRoles.includes(user.role) ? (
        children
      ) : (
        <Navigate to="/dashboard" replace />
      )}
    </ProtectedRoute>
  )
} 
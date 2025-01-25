import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { ProtectedRoute } from './ProtectedRoute'

interface RoleProtectedRouteProps {
  children: React.ReactNode
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
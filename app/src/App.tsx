/**
 * Root Application Component
 * 
 * Main router configuration and layout management for the Finance CRM.
 * Handles role-based routing, authentication state, and theme provider setup.
 * 
 * Features:
 * - Role-based route protection
 * - Automatic redirects based on user role
 * - Error boundary implementation
 * - Loading state during hydration
 * - Theme provider integration
 * 
 * Route Structure:
 * 1. Public Routes
 *    - /login - Authentication page
 *    - /recovery - Password recovery flow
 *    - /verification - Email verification flow
 * 
 * 2. Client Routes (role='CLIENT')
 *    - /portal - Client dashboard
 *    - /portal/create-ticket - New ticket creation
 *    - /portal/tickets/:ticketId - Client ticket view
 * 
 * 3. Agent/Manager Routes (role='AGENT'|'MANAGER')
 *    - /dashboard - Main dashboard
 *    - /tickets - Ticket management
 *    - /tickets/:ticketId - Ticket details
 * 
 * 4. Common Routes
 *    - /settings - User settings (all authenticated users)
 * 
 * @example
 * ```tsx
 * // Root component usage
 * ReactDOM.createRoot(document.getElementById('root')!).render(
 *   <BrowserRouter>
 *     <App />
 *   </BrowserRouter>
 * )
 * ```
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import { TicketsPage } from './pages/Tickets'
import TicketDetail from './pages/TicketDetail'
import ClientPortal from './pages/ClientPortal'
import CreateTicket from './pages/CreateTicket'
import Settings from './pages/Settings'
import Recovery from './pages/Recovery'
import Verification from './pages/Verification'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuthStore } from './stores/auth'
import { useHydrated } from './hooks/useHydrated'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ErrorBoundary } from 'react-error-boundary'
import { ThemeProvider } from './components/ThemeProvider'
import { RootLayout } from './components/layout/RootLayout'
import InboxPage from './pages/inbox/InboxPage'

/**
 * Error Fallback Component
 * 
 * Displays a user-friendly error message when a route encounters an error.
 * Used within ErrorBoundary components to gracefully handle route-level errors.
 * 
 * @param error - The error object caught by the error boundary
 */
function ErrorFallback({ error }: { error: Error }) {
  console.error('Error in route:', error)
  return (
    <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <pre className="text-sm bg-muted p-4 rounded">{error.message}</pre>
    </div>
  )
}

/**
 * Main Application Component
 * 
 * Manages the application's routing logic and high-level state.
 * Handles authentication state, role-based redirects, and route protection.
 * 
 * State Management:
 * - Uses useAuthStore for user authentication state
 * - Uses useHydrated to ensure auth state is loaded from storage
 * 
 * Route Protection:
 * - Public routes: login, recovery, verification
 * - Protected routes: wrapped in ProtectedRoute component
 * - Role-specific access control
 * 
 * Error Handling:
 * - ErrorBoundary components for critical routes
 * - Fallback UI for route-level errors
 */
function App() {
  const user = useAuthStore(state => state.user)
  const isHydrated = useHydrated()

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Only redirect if we're at the root path
  if (user && window.location.pathname === '/') {
    if (user.role === 'CLIENT') {
      return <Navigate to="/portal" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  return (
    <ThemeProvider>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/recovery" element={<Recovery />} />

          {/* Client routes */}
          <Route path="/portal" element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <ClientPortal />
            </ProtectedRoute>
          } />
          <Route path="/portal/create-ticket" element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <CreateTicket />
            </ProtectedRoute>
          } />
          <Route path="/portal/tickets/:ticketId" element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <TicketDetail />
              </ErrorBoundary>
            </ProtectedRoute>
          } />

          {/* Agent/Manager routes */}
          <Route path="/tickets" element={
            <ProtectedRoute allowedRoles={['AGENT', 'MANAGER']}>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <TicketsPage />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/tickets/:ticketId" element={
            <ProtectedRoute allowedRoles={['AGENT', 'MANAGER']}>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <TicketDetail />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['AGENT', 'MANAGER']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Settings route - accessible to all authenticated users */}
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={['CLIENT', 'AGENT', 'MANAGER']}>
              <Settings />
            </ProtectedRoute>
          } />

          {/* Verification route */}
          <Route path="/verification" element={<Verification />} />

          {/* Inbox route */}
          <Route path="/inbox/*" element={<InboxPage />} />

          {/* Default redirect - only if no other routes match */}
          <Route path="*" element={
            user ? (
              <Navigate to={user.role === 'CLIENT' ? '/portal' : '/dashboard'} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App 

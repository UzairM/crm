import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import { TicketsPage } from './pages/Tickets'
import TicketDetail from './pages/TicketDetail'
import ClientPortal from './pages/ClientPortal'
import CreateTicket from './pages/CreateTicket'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuthStore } from './stores/auth'
import { useHydrated } from './hooks/useHydrated'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error }: { error: Error }) {
  console.error('Error in route:', error)
  return (
    <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <pre className="text-sm bg-muted p-4 rounded">{error.message}</pre>
    </div>
  )
}

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

  // If we have a user, check their role for initial redirect
  if (user && window.location.pathname === '/') {
    if (user.role === 'CLIENT') {
      return <Navigate to="/portal" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Client routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['CLIENT']}>
          <Outlet />
        </ProtectedRoute>
      }>
        <Route path="/portal" element={<ClientPortal />} />
        <Route path="/portal/create-ticket" element={<CreateTicket />} />
      </Route>

      {/* Agent/Manager routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['AGENT', 'MANAGER']}>
          <Outlet />
        </ProtectedRoute>
      }>
        <Route path="/tickets" element={
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <TicketsPage />
          </ErrorBoundary>
        } />
        <Route path="/tickets/:ticketId" element={<TicketDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to={user?.role === 'CLIENT' ? '/portal' : '/dashboard'} replace />} />
    </Routes>
  )
}

export default App 

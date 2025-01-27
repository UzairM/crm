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

import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Tickets from './pages/Tickets'
import TicketDetail from './pages/TicketDetail'
import ClientPortal from './pages/ClientPortal'
import CreateTicket from './pages/CreateTicket'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleProtectedRoute } from './components/RoleProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/portal" element={
        <RoleProtectedRoute allowedRoles={['CLIENT']}>
          <ClientPortal />
        </RoleProtectedRoute>
      } />
      <Route path="/portal/create-ticket" element={
        <RoleProtectedRoute allowedRoles={['CLIENT']}>
          <CreateTicket />
        </RoleProtectedRoute>
      } />
      <Route path="/tickets" element={
        <ProtectedRoute>
          <Tickets />
        </ProtectedRoute>
      } />
      <Route path="/tickets/:ticketId" element={
        <ProtectedRoute>
          <TicketDetail />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App 

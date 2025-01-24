import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Tickets from './pages/Tickets'
import TicketDetail from './pages/TicketDetail'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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

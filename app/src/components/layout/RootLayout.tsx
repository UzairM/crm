/**
 * Root layout component that provides the basic page structure.
 * Includes the header, sidebar, main content area, and toast notifications.
 * Uses React Router's Outlet for nested route rendering.
 * 
 * @component
 * @example
 * ```tsx
 * // In your router configuration
 * <Route element={<RootLayout />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 *   <Route path="/tickets" element={<TicketList />} />
 * </Route>
 * ```
 */

import { Header } from '../Header'
import { Sidebar } from '../Sidebar'
import { Outlet } from 'react-router-dom'
import { Toaster } from '../ui/toaster'
import { useAuthStore } from '../../stores/auth'

export function RootLayout() {
  const user = useAuthStore((state) => state.user)
  const isLoginPage = window.location.pathname === '/login'
  const isInboxPage = window.location.pathname.startsWith('/inbox')

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {user && !isLoginPage && <Sidebar />}
      <main className={user && !isLoginPage ? "pl-16 transition-all duration-300" : ""}>
        <div className={isInboxPage ? "" : "container py-6"}>
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  )
} 
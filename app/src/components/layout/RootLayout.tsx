/**
 * Root layout component that provides the basic page structure.
 * Includes the header, main content area, and toast notifications.
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
import { Outlet } from 'react-router-dom'
import { Toaster } from '../ui/toaster'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
} 
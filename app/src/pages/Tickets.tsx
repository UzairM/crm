/**
 * Tickets List Page Component
 * 
 * Main interface for viewing and managing all tickets in the system.
 * Provides filtering, sorting, and quick actions for ticket management.
 * 
 * Features:
 * - Paginated ticket list
 * - Status-based filtering
 * - Priority sorting
 * - Quick actions (assign, close)
 * - SLA indicators
 * 
 * Access Control:
 * - Agents see assigned and unassigned tickets
 * - Managers see all tickets
 * - Clients redirected to portal view
 * 
 * @example
 * ```tsx
 * // In router configuration
 * <Route path="/tickets" element={<Tickets />} />
 * 
 * // With filters
 * <Tickets status="open" assignedTo="current-user" />
 * ```
 */

import { TicketList } from '../components/tickets/TicketList'

export function TicketsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <TicketList />
      </main>
    </div>
  )
} 
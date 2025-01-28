/**
 * Ticket Detail Page Component
 * 
 * Detailed view of a single ticket with full conversation history,
 * status management, and AI-suggested responses.
 * 
 * Features:
 * - Full ticket conversation thread
 * - Internal notes for agents
 * - Status and priority management
 * - AI-suggested responses
 * - File attachments
 * - SLA countdown timer
 * 
 * Views by Role:
 * - Agent: Full access with internal notes
 * - Manager: Complete access with SLA override
 * - Client: Limited view (no internal notes)
 * 
 * @example
 * ```tsx
 * // In router configuration
 * <Route path="/tickets/:id" element={<TicketDetail />} />
 * ```
 */

import { TicketDetail as TicketDetailComponent } from '../components/tickets/TicketDetail'

export default function TicketDetail() {
  return <TicketDetailComponent />
} 
export type TicketStatus = 'New' | 'Open' | 'Closed'

export interface Ticket {
  id: string
  subject: string
  status: TicketStatus
  assigned_agent_id: string | null
  client_id: string
  created_at: string
  updated_at: string
  is_read?: boolean
}

export interface TicketMessage {
  id: string
  ticket_id: string
  sender: string
  text: string
  is_internal_note: boolean
  created_at: string
} 
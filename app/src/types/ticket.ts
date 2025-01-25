export type TicketStatus = 'NEW' | 'OPEN' | 'CLOSED'

export interface Ticket {
  id: number
  subject: string
  status: TicketStatus
  assignedAgentId: number | null
  clientId: number
  isRead: boolean
  createdAt: string
  updatedAt: string
  client?: {
    id: number
    name: string
    email: string
  }
  assignedAgent?: {
    id: number
    name: string
    email: string
  }
}

export interface TicketMessage {
  id: number
  ticketId: number
  senderId: number
  text: string
  isInternalNote: boolean
  createdAt: string
  sender: {
    id: number
    name: string
    email: string
  }
} 
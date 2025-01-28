/**
 * Type definitions for the ticketing system.
 * Defines the structure of tickets and ticket messages.
 * Maps to the ticket and ticket_message tables in the Core CRM.
 */

/**
 * Possible states of a ticket
 * - NEW: Just created, not yet assigned
 * - OPEN: Being worked on by an agent
 * - CLOSED: Resolution complete
 */
export type TicketStatus = 'NEW' | 'OPEN' | 'CLOSED'

/**
 * Main ticket interface
 * Represents a support request or inquiry from a client
 */
export interface Ticket {
  /** Unique identifier */
  id: number
  /** Brief description of the ticket */
  subject: string
  /** Current status */
  status: TicketStatus
  /** ID of agent handling the ticket, null if unassigned */
  assignedAgentId: number | null
  /** ID of the client who created the ticket */
  clientId: number
  /** Whether the ticket has been viewed by assigned agent */
  isRead: boolean
  /** ISO timestamp of creation */
  createdAt: string
  /** ISO timestamp of last update */
  updatedAt: string
  /** Optional client details */
  client?: {
    /** Client's ID */
    id: number
    /** Client's name */
    name: string
    /** Client's email */
    email: string
  }
  /** Optional assigned agent details */
  assignedAgent?: {
    /** Agent's ID */
    id: number
    /** Agent's name */
    name: string
    /** Agent's email */
    email: string
  }
}

/**
 * Ticket message interface
 * Represents a single message or note in a ticket thread
 */
export interface TicketMessage {
  /** Unique identifier */
  id: number
  /** ID of the parent ticket */
  ticketId: number
  /** ID of the user who sent the message */
  senderId: number
  /** Message content */
  text: string
  /** Whether this is an internal note (only visible to agents) */
  isInternalNote: boolean
  /** ISO timestamp of creation */
  createdAt: string
  /** Details of the message sender */
  sender: {
    /** Sender's ID */
    id: number
    /** Sender's name */
    name: string
    /** Sender's email */
    email: string
  }
} 
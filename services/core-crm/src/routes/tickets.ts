import { Router, Request, Response } from 'express'
import { PrismaClient, Role, User } from '@prisma/client'
import { z } from 'zod'
import { validateRequest } from '../middleware/validateRequest'
import { requireAuth, requireRole } from '../middleware/auth'

// Extend Express's Request type
declare module 'express' {
  interface Request {
    user?: User
  }
}

const prisma = new PrismaClient()
const router = Router()

// Schema for creating a ticket
const createTicketSchema = z.object({
  body: z.object({
    subject: z.string().min(1),
    clientId: z.number().int().positive(),
    assignedAgentId: z.number().int().positive().optional(),
  }),
})

// Schema for updating a ticket
const updateTicketSchema = z.object({
  body: z.object({
    status: z.enum(['NEW', 'OPEN', 'CLOSED']).optional(),
    assignedAgentId: z.number().int().positive().optional(),
  }),
})

// Schema for creating a message
const createMessageSchema = z.object({
  body: z.object({
    text: z.string().min(1),
    isInternalNote: z.boolean().default(false),
  }),
})

// Get all tickets (filtered by role)
const getAllTickets = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  try {
    const { status, unread } = req.query

    let where: any = {}

    // Filter by status if provided
    if (status) {
      where.status = status.toString().toUpperCase()
    }

    // Filter by unread if provided
    if (unread === 'true') {
      where.isRead = false
    }

    // Role-based filtering
    if (req.user.role === Role.AGENT) {
      where.OR = [
        { assignedAgentId: req.user.id },
        { assignedAgentId: null }
      ]
    } else if (req.user.role === Role.CLIENT) {
      where.clientId = req.user.id
    }
    // Managers can see all tickets

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedAgent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    res.json(tickets)
    return
  } catch (error) {
    console.error('Failed to fetch tickets:', error)
    res.status(500).json({ message: 'Failed to fetch tickets' })
    return
  }
}

// Get a specific ticket
const getTicket = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  try {
    const { id } = req.params

    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(id) },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedAgent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' })
      return
    }

    // Check access based on role
    if (
      req.user.role === Role.CLIENT && ticket.clientId !== req.user.id ||
      req.user.role === Role.AGENT && ticket.assignedAgentId !== req.user.id && ticket.assignedAgentId !== null
    ) {
      res.status(403).json({ message: 'Access denied' })
      return 
    }

    res.json(ticket)
    return
  } catch (error) {
    console.error('Failed to fetch ticket:', error)
    res.status(500).json({ message: 'Failed to fetch ticket' })
    return
  }
}

// Create a new ticket
const createTicket = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  try {
    const { subject, clientId, assignedAgentId } = req.body

    // Only managers can create tickets for any client
    if (req.user.role !== Role.MANAGER && clientId !== req.user.id) {
       res.status(403).json({ message: 'Can only create tickets for yourself' })
       return
    }

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        clientId,
        assignedAgentId,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedAgent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    res.status(201).json(ticket)
    return
  } catch (error) {
    console.error('Failed to create ticket:', error)
    res.status(500).json({ message: 'Failed to create ticket' })
    return
  }
}

// Update a ticket
const updateTicket = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  try {
    const { id } = req.params
    const { status, assignedAgentId } = req.body

    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(id) },
    })

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' })
      return
    }

    // Only managers can reassign tickets
    if (assignedAgentId && req.user.role !== Role.MANAGER) {
      res.status(403).json({ message: 'Only managers can reassign tickets' })
      return
    }

    // Allow clients to update status of their own tickets
    if (status && req.user.role === Role.CLIENT) {
      if (ticket.clientId !== req.user.id) {
        res.status(403).json({ message: 'Can only update your own tickets' })
        return
      }
    } 
    // For agents, only assigned agent or manager can update status
    else if (
      status &&
      req.user.role !== Role.MANAGER &&
      (req.user.role !== Role.AGENT || ticket.assignedAgentId !== req.user.id)
    ) {
      res.status(403).json({ message: 'Cannot update ticket status' })
      return
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: parseInt(id) },
      data: {
        ...(status && { status }),
        ...(assignedAgentId && { assignedAgentId }),
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedAgent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    res.json(updatedTicket)
    return
  } catch (error) {
    console.error('Failed to update ticket:', error)
    res.status(500).json({ message: 'Failed to update ticket' })
    return
  }
}

// Mark ticket as read
const markTicketAsRead = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  try {
    const { id } = req.params
    const ticketId = parseInt(id)

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    })

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' })
      return
    }

    // Check access based on role
    if (
      req.user.role === Role.CLIENT && ticket.clientId !== req.user.id ||
      req.user.role === Role.AGENT && ticket.assignedAgentId !== req.user.id && ticket.assignedAgentId !== null
    ) {
      res.status(403).json({ message: 'Access denied' })
      return
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { isRead: true },
    })

    res.json(updatedTicket)
    return
  } catch (error) {
    console.error('Failed to mark ticket as read:', error)
    res.status(500).json({ message: 'Failed to mark ticket as read' })
    return
  }
}

// Add a message to a ticket
const createMessage = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  try {
    const { id } = req.params
    const { text, isInternalNote } = req.body

    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(id) },
    })

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' })
      return
    }

    // Check access based on role
    if (
      req.user.role === Role.CLIENT && ticket.clientId !== req.user.id ||
      req.user.role === Role.AGENT && ticket.assignedAgentId !== req.user.id && ticket.assignedAgentId !== null
    ) {
      res.status(403).json({ message: 'Access denied' })
      return
    }

    // Only agents and managers can create internal notes
    if (isInternalNote && req.user.role === Role.CLIENT) {
      res.status(403).json({ message: 'Clients cannot create internal notes' })
      return
    }

    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: parseInt(id),
        senderId: req.user.id,
        text,
        isInternalNote,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Update ticket status to OPEN if it was NEW
    if (ticket.status === 'NEW') {
      await prisma.ticket.update({
        where: { id: parseInt(id) },
        data: { status: 'OPEN' },
      })
    }

    res.status(201).json(message)
    return
  } catch (error) {
    console.error('Failed to create message:', error)
    res.status(500).json({ message: 'Failed to create message' })
    return
  }
}

// Get messages for a ticket
const getMessages = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  try {
    const { id } = req.params

    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(id) },
    })

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' })
      return
    }

    // Check access based on role
    if (
      req.user.role === Role.CLIENT && ticket.clientId !== req.user.id ||
      req.user.role === Role.AGENT && ticket.assignedAgentId !== req.user.id && ticket.assignedAgentId !== null
    ) {
      res.status(403).json({ message: 'Access denied' })
      return
    }

    // Clients cannot see internal notes
    const where: any = {
      ticketId: parseInt(id),
    }
    if (req.user.role === Role.CLIENT) {
      where.isInternalNote = false
    }

    const messages = await prisma.ticketMessage.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    res.json(messages)
    return
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    res.status(500).json({ message: 'Failed to fetch messages' })
    return
  }
}

// Register routes
router.get('/', requireAuth, requireRole([Role.MANAGER, Role.AGENT, Role.CLIENT]), getAllTickets)
router.get('/:id', requireAuth, requireRole([Role.MANAGER, Role.AGENT, Role.CLIENT]), getTicket)
router.post('/', requireAuth, validateRequest(createTicketSchema), requireRole([Role.MANAGER, Role.CLIENT]), createTicket)
router.patch('/:id', requireAuth, validateRequest(updateTicketSchema), requireRole([Role.MANAGER, Role.AGENT, Role.CLIENT]), updateTicket)
router.patch('/:id/read', requireAuth, requireRole([Role.MANAGER, Role.AGENT]), markTicketAsRead)
router.post('/:id/messages', requireAuth, validateRequest(createMessageSchema), requireRole([Role.MANAGER, Role.AGENT, Role.CLIENT]), createMessage)
router.get('/:id/messages', requireAuth, requireRole([Role.MANAGER, Role.AGENT, Role.CLIENT]), getMessages)

export default router 

import { Router, Request, Response, RequestHandler, NextFunction } from 'express'
import { PrismaClient, Role, User, Prisma } from '@prisma/client'
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
const getAllTickets = async (req: Request, res: Response): Promise<any> => {
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
const getTicket = async (req: Request, res: Response): Promise<any> => {
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
      return res.status(404).json({ message: 'Ticket not found' })
    }

    // Check access based on role
    if (
      req.user.role === Role.CLIENT && ticket.clientId !== req.user.id ||
      req.user.role === Role.AGENT && ticket.assignedAgentId !== req.user.id && ticket.assignedAgentId !== null
    ) {
      return res.status(403).json({ message: 'Access denied' })
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
const createTicket = async (req: Request, res: Response): Promise<any> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  try {
    const { subject, clientId, assignedAgentId } = req.body

    // Only managers can create tickets for any client
    if (req.user.role !== Role.MANAGER && clientId !== req.user.id) {
      return res.status(403).json({ message: 'Can only create tickets for yourself' })
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
const updateTicket = async (req: Request, res: Response): Promise<any> => {
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
      return res.status(404).json({ message: 'Ticket not found' })
    }

    // Only managers can reassign tickets
    if (assignedAgentId && req.user.role !== Role.MANAGER) {
      return res.status(403).json({ message: 'Only managers can reassign tickets' })
    }

    // Only assigned agent or manager can update status
    if (
      status &&
      req.user.role !== Role.MANAGER &&
      (req.user.role !== Role.AGENT || ticket.assignedAgentId !== req.user.id)
    ) {
      return res.status(403).json({ message: 'Cannot update ticket status' })
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
const markTicketAsRead = async (req: Request, res: Response): Promise<any> => {
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
      return res.status(404).json({ message: 'Ticket not found' })
    }

    // Check access based on role
    if (
      req.user.role === Role.CLIENT && ticket.clientId !== req.user.id ||
      req.user.role === Role.AGENT && ticket.assignedAgentId !== req.user.id && ticket.assignedAgentId !== null
    ) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: parseInt(id) },
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
const createMessage = async (req: Request, res: Response): Promise<any> => {
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
      return res.status(404).json({ message: 'Ticket not found' })
    }

    // Check access based on role
    if (
      req.user.role === Role.CLIENT && ticket.clientId !== req.user.id ||
      req.user.role === Role.AGENT && ticket.assignedAgentId !== req.user.id && ticket.assignedAgentId !== null
    ) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // Only agents and managers can create internal notes
    if (isInternalNote && req.user.role === Role.CLIENT) {
      return res.status(403).json({ message: 'Clients cannot create internal notes' })
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
const getMessages = async (req: Request, res: Response): Promise<any> => {
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
      return res.status(404).json({ message: 'Ticket not found' })
    }

    // Check access based on role
    if (
      req.user.role === Role.CLIENT && ticket.clientId !== req.user.id ||
      req.user.role === Role.AGENT && ticket.assignedAgentId !== req.user.id && ticket.assignedAgentId !== null
    ) {
      return res.status(403).json({ message: 'Access denied' })
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
router.get('/', requireAuth, getAllTickets as RequestHandler)
router.get('/:id', requireAuth, getTicket as RequestHandler)
router.post('/', requireAuth, validateRequest(createTicketSchema), requireRole([Role.MANAGER, Role.CLIENT]), createTicket as RequestHandler)
router.patch('/:id', requireAuth, validateRequest(updateTicketSchema), requireRole([Role.MANAGER, Role.AGENT]), updateTicket as RequestHandler)
router.patch('/:id/read', requireAuth, markTicketAsRead as RequestHandler)
router.post('/:id/messages', requireAuth, validateRequest(createMessageSchema), createMessage as RequestHandler)
router.get('/:id/messages', requireAuth, getMessages as RequestHandler)

export default router 

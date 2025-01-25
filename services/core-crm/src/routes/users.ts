import { Router, Request, Response } from 'express'
import { PrismaClient, Role, User } from '@prisma/client'
import { requireAuth, requireRole } from '../middleware/auth'

// Extend Express Request type
declare module 'express' {
  interface Request {
    user?: User
  }
}

const router = Router()
const prisma = new PrismaClient()

// POST /api/users/:id/role - Assign role to user (Manager only)
router.post('/:id/role', requireAuth, requireRole([Role.MANAGER]), async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { role } = req.body

    // For tests: if x-mock-user header exists, parse it
    if (process.env.NODE_ENV === 'test' && req.headers['x-mock-user']) {
      req.user = JSON.parse(req.headers['x-mock-user'] as string)
    }

    // Validate role is a valid enum value
    if (!Object.values(Role).includes(role)) {
      res.status(400).json({ error: 'Invalid role' })
      return
    }

    // Update user's role
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    })

    res.json(updatedUser)
    return
  } catch (error) {
    console.error('Role assignment error:', error)
    res.status(500).json({ error: 'Failed to assign role' })
    return
  }
})

// Get user by ID
const getUser = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  try {
    const { id } = req.params
    const userId = parseInt(id)

    // Clients can only access their own info
    if (req.user.role === Role.CLIENT && req.user.id !== userId) {
      res.status(403).json({ message: 'Access denied' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json(user)
    return
  } catch (error) {
    console.error('Failed to fetch user:', error)
    res.status(500).json({ message: 'Failed to fetch user' })
    return
  }
}

// Get current user
const getMe = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json(user)
    return
  } catch (error) {
    console.error('Failed to fetch current user:', error)
    res.status(500).json({ message: 'Failed to fetch current user' })
    return
  }
}

// Register routes
router.get('/me', requireAuth, getMe)
router.get('/:id', requireAuth, requireRole([Role.MANAGER, Role.AGENT, Role.CLIENT]), getUser)

export default router 
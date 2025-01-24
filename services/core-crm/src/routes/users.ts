import { Router } from 'express'
import { PrismaClient, Role } from '@prisma/client'
import { requireAuth, requireRole } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// POST /api/users/:id/role - Assign role to user (Manager only)
router.post('/:id/role', requireAuth, requireRole([Role.MANAGER]), async (req, res) => {
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

export default router 
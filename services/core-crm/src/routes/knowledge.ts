import { Router, Request } from 'express'
import { z } from 'zod'
import prisma from '../utils/db'
import { requireAuth, requireRole } from '../middleware/auth'
import { Role } from '@prisma/client'

// Define the authenticated request type
interface AuthenticatedRequest extends Request {
  user?: {
    id: number
    createdAt: Date
    updatedAt: Date
    name: string | null
    oryIdentityId: string
    email: string
    role: Role
    isActive: boolean
  }
}

const router = Router()

// Schema for creating/updating articles
const articleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT')
})

// GET /api/kb/articles - List all articles
router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const articles = await prisma.knowledgeArticle.findMany({
    where: {
      status: req.user.role === Role.MANAGER ? undefined : 'PUBLISHED'
    },
    include: {
      author: true
    }
  })

  res.json(articles)
  return
})

// GET /api/kb/articles/:id - Get article details
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const { id } = req.params
  const article = await prisma.knowledgeArticle.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: true
    }
  })

  if (!article) {
    res.status(404).json({ message: 'Article not found' })
    return
  }

  if (article.status === 'DRAFT' && req.user.role !== Role.MANAGER) {
    res.status(403).json({ message: 'Cannot view draft articles' })
    return
  }

  res.json(article)
  return
})

// POST /api/kb/articles - Create article (MANAGER only)
router.post('/', requireAuth, requireRole([Role.MANAGER]), async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const result = articleSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ errors: result.error.errors })
    return
  }

  const article = await prisma.knowledgeArticle.create({
    data: {
      ...result.data,
      authorId: req.user.id
    },
    include: {
      author: true
    }
  })

  res.status(201).json(article)
  return
})

// PUT /api/kb/articles/:id - Update article (MANAGER only)
router.put('/:id', requireAuth, requireRole([Role.MANAGER]), async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const { id } = req.params
  const result = articleSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ errors: result.error.errors })
    return
  }

  const article = await prisma.knowledgeArticle.update({
    where: { id: parseInt(id) },
    data: result.data,
    include: {
      author: true
    }
  })

  res.json(article)
  return
})

// DELETE /api/kb/articles/:id - Delete article (MANAGER only)
router.delete('/:id', requireAuth, requireRole([Role.MANAGER]), async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const { id } = req.params

  try {
    await prisma.knowledgeArticle.delete({
      where: { id: parseInt(id) }
    })

    res.status(204).send()
    return
  } catch (error) {
    res.status(404).json({ message: 'Article not found' })
    return
  }
})

export default router
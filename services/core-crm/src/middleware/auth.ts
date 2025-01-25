import { Configuration, FrontendApi } from '@ory/client'
import { PrismaClient, Role, User } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'

// Extend Express Request type
declare module 'express' {
  interface Request {
    user?: User
    session?: any
  }
}

const prisma = new PrismaClient()

// Initialize ORY SDK
const ory = new FrontendApi(
  new Configuration({
    basePath: process.env.ORY_BASE_URL || 'http://localhost:4000',
    baseOptions: {
      withCredentials: true
    }
  })
)

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // For tests: if x-mock-user header exists, parse it
    if (process.env.NODE_ENV === 'test' && req.headers['x-mock-user']) {
      req.user = JSON.parse(req.headers['x-mock-user'] as string)
      next()
      return
    }

    // Get the cookie from request
    const cookie = req.headers.cookie

    if (!cookie) {
      res.status(401).json({ error: 'No session cookie found' })
      return
    }

    // Verify session with ORY
    const { data: session } = await ory.toSession({
      cookie: cookie,
    })

    if (!session?.identity) {
      res.status(401).json({ error: 'Invalid session' })
      return
    }

    // Check if user exists in our DB
    let user = await prisma.user.findUnique({
      where: {
        oryIdentityId: session.identity.id,
      },
    })

    // If user doesn't exist, create one with default role CLIENT
    if (!user) {
      const traits = session.identity.traits as { email: string }
      
      user = await prisma.user.create({
        data: {
          oryIdentityId: session.identity.id,
          email: traits.email,
          role: Role.CLIENT,
        },
      })
    }

    // Store session and user info in request for route handlers
    req.session = session
    req.user = user

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({ error: 'Authentication failed' })
    return
  }
}

// Middleware to check role authorization
export function requireRole(allowedRoles: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user

      if (!user) {
        res.status(401).json({ error: 'User not found' })
        return
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({ error: 'Insufficient permissions' })
        return
      }

      next()
    } catch (error) {
      console.error('Role check error:', error)
      res.status(500).json({ error: 'Role verification failed' })
      return
    }
  }
}
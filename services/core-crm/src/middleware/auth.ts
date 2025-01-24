import { Configuration, FrontendApi } from '@ory/client'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

// Initialize ORY SDK
const ory = new FrontendApi(
  new Configuration({
    basePath: process.env.ORY_SDK_URL,
  })
)

export async function requireAuth(req: any, res: any, next: any) {
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
      const traits = session.identity.traits as { email: string; name?: { first?: string; last?: string } }
      const fullName = traits.name 
        ? `${traits.name.first || ''} ${traits.name.last || ''}`.trim() 
        : null

      user = await prisma.user.create({
        data: {
          oryIdentityId: session.identity.id,
          email: traits.email,
          name: fullName,
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
  return async (req: any, res: any, next: any) => {
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
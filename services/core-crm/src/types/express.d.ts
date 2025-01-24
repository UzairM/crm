import { Session } from '@ory/client'
import { User } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      session?: Session
      user?: User
    }
  }
} 
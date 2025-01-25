import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { json } from 'body-parser'
import usersRouter from './routes/users'
import ticketsRouter from './routes/tickets'
import healthRoutes from './routes/health'

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(morgan('dev'))
app.use(json())

// Routes
app.use('/', healthRoutes)
app.use('/api/users', usersRouter)
app.use('/api/tickets', ticketsRouter)

export default app 

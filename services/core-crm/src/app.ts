import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { json } from 'body-parser'
import usersRouter from './routes/users'
import ticketsRouter from './routes/tickets'
import healthRoutes from './routes/health'
import knowledgeRouter from './routes/knowledge'

const app = express()

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials']
}

// Middleware
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(json())

// Routes
app.use('/', healthRoutes)
app.use('/api/users', usersRouter)
app.use('/api/tickets', ticketsRouter)
app.use('/api/kb', knowledgeRouter)

export default app 

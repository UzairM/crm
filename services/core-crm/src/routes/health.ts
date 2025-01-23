import { Router, Request, Response } from 'express';
import { testConnection } from '../utils/db';

const router = Router();

// Health check route
router.get('/health', async (_req: Request, res: Response) => {
  const dbConnected = await testConnection();
  
  res.json({
    status: 'ok',
    service: 'core-crm',
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Ping route
router.get('/ping', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export default router; 
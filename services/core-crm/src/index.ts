import express from 'express';
import { config } from './config/env';
import healthRoutes from './routes/health';
import userRoutes from './routes/users';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/', healthRoutes);
app.use('/api/users', userRoutes);

// Start server
app.listen(config.port, () => {
  console.log(`Core CRM service listening at http://localhost:${config.port}`);
}); 
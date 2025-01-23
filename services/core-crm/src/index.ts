import express from 'express';
import { config } from './config/env';
import healthRoutes from './routes/health';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/', healthRoutes);

// Start server
app.listen(config.port, () => {
  console.log(`Core CRM service listening at http://localhost:${config.port}`);
}); 
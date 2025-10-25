import express from 'express';
import usersRouter from './users.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'School Scheduler API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API version info
router.get('/', (req, res) => {
  res.json({
    name: 'School Scheduler API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      auth: '/api/auth (coming in iteration 2)',
      classes: '/api/classes (coming in iteration 3)',
      schedule: '/api/schedule (coming in iteration 4)',
      enrollments: '/api/enrollments (coming in iteration 5)'
    }
  });
});

// Mount route modules
router.use('/users', usersRouter);

export default router;

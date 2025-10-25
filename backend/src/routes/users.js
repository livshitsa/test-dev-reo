import express from 'express';
import User from '../models/User.js';

const router = express.Router();

/**
 * GET /api/users
 * Get all users (excluding password hash)
 */
router.get('/', (req, res) => {
  try {
    const users = User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', (req, res) => {
  try {
    const user = User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * GET /api/users/role/:role
 * Get users by role (admin, teacher, student)
 */
router.get('/role/:role', (req, res) => {
  try {
    const { role } = req.params;
    if (!['admin', 'teacher', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const users = User.findByRole(role);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;

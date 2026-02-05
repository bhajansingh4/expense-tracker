const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// GET /api/users/me - Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/me - Update user profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ message: 'Please provide data to update' });
    }

    let updateQuery = 'UPDATE users SET ';
    const updateValues = [];

    if (name) {
      updateQuery += 'name = ?';
      updateValues.push(name);
    }

    if (email) {
      if (name) updateQuery += ', ';
      updateQuery += 'email = ?';
      updateValues.push(email);
    }

    updateQuery += ' WHERE id = ?';
    updateValues.push(req.user.userId);

    await db.query(updateQuery, updateValues);

    const [users] = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    res.json({ message: 'Profile updated successfully', user: users[0] });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/users/me - Delete user account
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.user.userId]);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

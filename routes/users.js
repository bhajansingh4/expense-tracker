const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Validation helper
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// GET /api/users/me - Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const users = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (users.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      data: users.rows[0] 
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching user profile' 
    });
  }
});

// PUT /api/users/me - Update user profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide name or email to update' 
      });
    }

    // If email is provided, validate it and check if it's already in use
    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ 
          success: false,
          message: 'Please provide a valid email address' 
        });
      }

      // Check if email is already used by another user
      const existingEmail = await db.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, req.user.userId]
      );

      if (existingEmail.rows.length > 0) {
        return res.status(400).json({ 
          success: false,
          message: 'Email is already in use' 
        });
      }
    }

    let updateQuery = 'UPDATE users SET ';
    const updateValues = [];
    let paramCount = 1;

    if (name && name.trim()) {
      updateQuery += `name = $${paramCount}`;
      updateValues.push(name.trim());
      paramCount++;
    }

    if (email) {
      if (name && name.trim()) updateQuery += ', ';
      updateQuery += `email = $${paramCount}`;
      updateValues.push(email);
      paramCount++;
    }

    updateQuery += ` WHERE id = $${paramCount}`;
    updateValues.push(req.user.userId);

    await db.query(updateQuery, updateValues);

    const users = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    res.status(200).json({ 
      success: true,
      message: 'Profile updated successfully', 
      data: users.rows[0] 
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating profile' 
    });
  }
});

// DELETE /api/users/me - Delete user account
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = $1', [req.user.userId]);
    res.status(200).json({ 
      success: true,
      message: 'Account deleted successfully' 
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting account' 
    });
  }
});

module.exports = router;

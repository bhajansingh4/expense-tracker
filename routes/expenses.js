const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// All expense routes require authentication
router.use(authMiddleware);

// GET /api/expenses - Get all expenses for logged-in user
router.get('/', async (req, res) => {
  try {
    const [expenses] = await db.query(
      `SELECT e.*, c.name as category_name 
       FROM expenses e 
       JOIN categories c ON e.category_id = c.id 
       WHERE e.user_id = ? 
       ORDER BY e.date DESC`,
      [req.user.userId]
    );

    res.json({ expenses });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/expenses/:id - Get single expense
router.get('/:id', async (req, res) => {
  try {
    const [expenses] = await db.query(
      `SELECT e.*, c.name as category_name 
       FROM expenses e 
       JOIN categories c ON e.category_id = c.id 
       WHERE e.id = ? AND e.user_id = ?`,
      [req.params.id, req.user.userId]
    );

    if (expenses.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ expense: expenses[0] });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/expenses - Create new expense
router.post('/', async (req, res) => {
  try {
    const { category_id, amount, description, date } = req.body;

    // Validate input
    if (!category_id || !amount || !date) {
      return res.status(400).json({ message: 'Please provide category, amount, and date' });
    }

    // Verify category belongs to user
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE id = ? AND user_id = ?',
      [category_id, req.user.userId]
    );

    if (categories.length === 0) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Insert expense
    const [result] = await db.query(
      'INSERT INTO expenses (user_id, category_id, amount, description, date) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, category_id, amount, description || '', date]
    );

    // Get created expense
    const [expenses] = await db.query(
      `SELECT e.*, c.name as category_name 
       FROM expenses e 
       JOIN categories c ON e.category_id = c.id 
       WHERE e.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Expense created successfully',
      expense: expenses[0]
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/expenses/:id - Update expense
router.put('/:id', async (req, res) => {
  try {
    const { category_id, amount, description, date } = req.body;

    // Check if expense exists and belongs to user
    const [existingExpenses] = await db.query(
      'SELECT * FROM expenses WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (existingExpenses.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // If category_id is provided, verify it belongs to user
    if (category_id) {
      const [categories] = await db.query(
        'SELECT * FROM categories WHERE id = ? AND user_id = ?',
        [category_id, req.user.userId]
      );

      if (categories.length === 0) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    // Build update query
    let updateQuery = 'UPDATE expenses SET ';
    const updateValues = [];

    if (category_id !== undefined) {
      updateQuery += 'category_id = ?, ';
      updateValues.push(category_id);
    }
    if (amount !== undefined) {
      updateQuery += 'amount = ?, ';
      updateValues.push(amount);
    }
    if (description !== undefined) {
      updateQuery += 'description = ?, ';
      updateValues.push(description);
    }
    if (date !== undefined) {
      updateQuery += 'date = ?, ';
      updateValues.push(date);
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ' WHERE id = ? AND user_id = ?';
    updateValues.push(req.params.id, req.user.userId);

    await db.query(updateQuery, updateValues);

    // Get updated expense
    const [expenses] = await db.query(
      `SELECT e.*, c.name as category_name 
       FROM expenses e 
       JOIN categories c ON e.category_id = c.id 
       WHERE e.id = ?`,
      [req.params.id]
    );

    res.json({
      message: 'Expense updated successfully',
      expense: expenses[0]
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM expenses WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

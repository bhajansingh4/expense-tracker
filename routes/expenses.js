const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// All expense routes require authentication
router.use(authMiddleware);

// GET /api/expenses - Get all expenses for logged-in user
router.get('/', async (req, res) => {
  try {
    const expenses = await db.query(
      `SELECT e.id, e.user_id, e.category_id, e.amount, e.description, e.date, e.created_at, c.name as category_name 
       FROM expenses e 
       JOIN categories c ON e.category_id = c.id 
       WHERE e.user_id = $1 
       ORDER BY e.date DESC`,
      [req.user.userId]
    );

    res.status(200).json({ 
      success: true,
      data: expenses.rows,
      count: expenses.rows.length 
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching expenses' 
    });
  }
});

// GET /api/expenses/:id - Get single expense
router.get('/:id', async (req, res) => {
  try {
    const expenses = await db.query(
      `SELECT e.id, e.user_id, e.category_id, e.amount, e.description, e.date, e.created_at, c.name as category_name 
       FROM expenses e 
       JOIN categories c ON e.category_id = c.id 
       WHERE e.id = $1 AND e.user_id = $2`,
      [req.params.id, req.user.userId]
    );

    if (expenses.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Expense not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      data: expenses.rows[0] 
    });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching expense' 
    });
  }
});

// POST /api/expenses - Create new expense
router.post('/', async (req, res) => {
  try {
    const { category_id, amount, description, date } = req.body;

    // Validate input
    if (!category_id || amount === undefined || amount === null || !date) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide category_id, amount, and date' 
      });
    }

    // Validate amount is a positive number
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Amount must be a positive number' 
      });
    }

    // Verify category belongs to user
    const categories = await db.query(
      'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
      [category_id, req.user.userId]
    );

    if (categories.rows.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid category or category does not belong to user' 
      });
    }

    // Insert expense
    const result = await db.query(
      'INSERT INTO expenses (user_id, category_id, amount, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [req.user.userId, category_id, parseFloat(amount), description || null, date]
    );

    const expenseId = result.rows[0].id;

    // Get created expense
    const expenses = await db.query(
      `SELECT e.id, e.user_id, e.category_id, e.amount, e.description, e.date, e.created_at, c.name as category_name 
       FROM expenses e 
       JOIN categories c ON e.category_id = c.id 
       WHERE e.id = $1`,
      [expenseId]
    );

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expenses.rows[0]
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error creating expense' 
    });
  }
});

// PUT /api/expenses/:id - Update expense
router.put('/:id', async (req, res) => {
  try {
    const { category_id, amount, description, date } = req.body;

    // Check if expense exists and belongs to user
    const existingExpenses = await db.query(
      'SELECT id FROM expenses WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (existingExpenses.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Expense not found' 
      });
    }

    // If category_id is provided, verify it belongs to user
    if (category_id !== undefined && category_id !== null) {
      const categories = await db.query(
        'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
        [category_id, req.user.userId]
      );

      if (categories.rows.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'Invalid category or category does not belong to user' 
        });
      }
    }

    // Validate amount if provided
    if (amount !== undefined && amount !== null) {
      if (isNaN(amount) || parseFloat(amount) <= 0) {
        return res.status(400).json({ 
          success: false,
          message: 'Amount must be a positive number' 
        });
      }
    }

    // Build update query
    let updateQuery = 'UPDATE expenses SET ';
    const updateValues = [];
    let paramCount = 1;

    if (category_id !== undefined && category_id !== null) {
      updateQuery += `category_id = $${paramCount}, `;
      updateValues.push(category_id);
      paramCount++;
    }
    if (amount !== undefined && amount !== null) {
      updateQuery += `amount = $${paramCount}, `;
      updateValues.push(parseFloat(amount));
      paramCount++;
    }
    if (description !== undefined) {
      updateQuery += `description = $${paramCount}, `;
      updateValues.push(description || null);
      paramCount++;
    }
    if (date !== undefined && date !== null) {
      updateQuery += `date = $${paramCount}, `;
      updateValues.push(date);
      paramCount++;
    }

    // If no fields to update, return error
    if (updateValues.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No fields to update provided' 
      });
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ` WHERE id = $${paramCount} AND user_id = $${paramCount + 1}`;
    updateValues.push(req.params.id, req.user.userId);

    await db.query(updateQuery, updateValues);

    // Get updated expense
    const expenses = await db.query(
      `SELECT e.id, e.user_id, e.category_id, e.amount, e.description, e.date, e.created_at, c.name as category_name 
       FROM expenses e 
       JOIN categories c ON e.category_id = c.id 
       WHERE e.id = $1`,
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expenses.rows[0]
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating expense' 
    });
  }
});

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Expense not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Expense deleted successfully' 
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting expense' 
    });
  }
});

module.exports = router;

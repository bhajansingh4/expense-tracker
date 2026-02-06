const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// All category routes require authentication
router.use(authMiddleware);

// GET /api/categories - Get all categories for logged-in user
router.get('/', async (req, res) => {
  try {
    const categories = await db.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY name',
      [req.user.userId]
    );

    res.json({ categories: categories.rows });
  } catch (error) {
    console.error('Get categories error:', error.message, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/categories - Create new category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please provide category name' });
    }

    // Check if category with same name already exists for this user
    const existing = await db.query(
      'SELECT * FROM categories WHERE name = $1 AND user_id = $2',
      [name, req.user.userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const result = await db.query(
      'INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING id',
      [name, req.user.userId]
    );

    const categoryId = result.rows[0].id;

    const categories = await db.query(
      'SELECT * FROM categories WHERE id = $1',
      [categoryId]
    );

    res.status(201).json({
      message: 'Category created successfully',
      category: categories.rows[0]
    });
  } catch (error) {
    console.error('Create category error:', error.message, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/categories/:id - Update category
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please provide category name' });
    }

    // Check if category exists and belongs to user
    const existing = await db.query(
      'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if another category with same name exists
    const duplicate = await db.query(
      'SELECT * FROM categories WHERE name = $1 AND user_id = $2 AND id != $3',
      [name, req.user.userId, req.params.id]
    );

    if (duplicate.rows.length > 0) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    await db.query(
      'UPDATE categories SET name = $1 WHERE id = $2 AND user_id = $3',
      [name, req.params.id, req.user.userId]
    );

    const categories = await db.query(
      'SELECT * FROM categories WHERE id = $1',
      [req.params.id]
    );

    res.json({
      message: 'Category updated successfully',
      category: categories.rows[0]
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/categories/:id - Delete category
router.delete('/:id', async (req, res) => {
  try {
    // Check if category has expenses
    const expenses = await db.query(
      'SELECT COUNT(*) as count FROM expenses WHERE category_id = $1',
      [req.params.id]
    );

    if (parseInt(expenses.rows[0].count) > 0) {
      return res.status(400).json({
        message: 'Cannot delete category with existing expenses'
      });
    }

    const result = await db.query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

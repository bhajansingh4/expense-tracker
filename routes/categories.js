const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// All category routes require authentication
router.use(authMiddleware);

// GET /api/categories - Get all categories for logged-in user
router.get('/', async (req, res) => {
  try {
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE user_id = ? ORDER BY name',
      [req.user.userId]
    );

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
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
    const [existing] = await db.query(
      'SELECT * FROM categories WHERE name = ? AND user_id = ?',
      [name, req.user.userId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO categories (name, user_id) VALUES (?, ?)',
      [name, req.user.userId]
    );

    const [categories] = await db.query(
      'SELECT * FROM categories WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Category created successfully',
      category: categories[0]
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
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
    const [existing] = await db.query(
      'SELECT * FROM categories WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if another category with same name exists
    const [duplicate] = await db.query(
      'SELECT * FROM categories WHERE name = ? AND user_id = ? AND id != ?',
      [name, req.user.userId, req.params.id]
    );

    if (duplicate.length > 0) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    await db.query(
      'UPDATE categories SET name = ? WHERE id = ? AND user_id = ?',
      [name, req.params.id, req.user.userId]
    );

    const [categories] = await db.query(
      'SELECT * FROM categories WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Category updated successfully',
      category: categories[0]
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
    const [expenses] = await db.query(
      'SELECT COUNT(*) as count FROM expenses WHERE category_id = ?',
      [req.params.id]
    );

    if (expenses[0].count > 0) {
      return res.status(400).json({
        message: 'Cannot delete category with existing expenses'
      });
    }

    const [result] = await db.query(
      'DELETE FROM categories WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

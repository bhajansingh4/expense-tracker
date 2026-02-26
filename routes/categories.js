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
      'SELECT id, name, user_id, created_at FROM categories WHERE user_id = $1 ORDER BY name',
      [req.user.userId]
    );

    res.status(200).json({ 
      success: true,
      data: categories.rows,
      count: categories.rows.length
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching categories' 
    });
  }
});

// POST /api/categories - Create new category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a category name' 
      });
    }

    // Check if category with same name already exists for this user
    const existing = await db.query(
      'SELECT id FROM categories WHERE LOWER(name) = LOWER($1) AND user_id = $2',
      [name, req.user.userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Category with this name already exists' 
      });
    }

    const result = await db.query(
      'INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING id',
      [name.trim(), req.user.userId]
    );

    const categoryId = result.rows[0].id;

    const categories = await db.query(
      'SELECT id, name, user_id, created_at FROM categories WHERE id = $1',
      [categoryId]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: categories.rows[0]
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error creating category' 
    });
  }
});

// PUT /api/categories/:id - Update category
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a category name' 
      });
    }

    // Check if category exists and belongs to user
    const existing = await db.query(
      'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Category not found' 
      });
    }

    // Check if another category with same name exists
    const duplicate = await db.query(
      'SELECT id FROM categories WHERE LOWER(name) = LOWER($1) AND user_id = $2 AND id != $3',
      [name, req.user.userId, req.params.id]
    );

    if (duplicate.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Category with this name already exists' 
      });
    }

    await db.query(
      'UPDATE categories SET name = $1 WHERE id = $2 AND user_id = $3',
      [name.trim(), req.params.id, req.user.userId]
    );

    const categories = await db.query(
      'SELECT id, name, user_id, created_at FROM categories WHERE id = $1',
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: categories.rows[0]
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating category' 
    });
  }
});

// DELETE /api/categories/:id - Delete category
router.delete('/:id', async (req, res) => {
  try {
    // Check if category belongs to user first
    const categoryCheck = await db.query(
      'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Category not found' 
      });
    }

    // Check if category has expenses
    const expenses = await db.query(
      'SELECT COUNT(*) as count FROM expenses WHERE category_id = $1',
      [req.params.id]
    );

    if (parseInt(expenses.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing expenses. Please delete associated expenses first.'
      });
    }

    const result = await db.query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    res.status(200).json({ 
      success: true,
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting category' 
    });
  }
});

module.exports = router;

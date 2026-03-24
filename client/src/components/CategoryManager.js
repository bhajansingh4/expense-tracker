import React, { useState } from 'react';
import apiClient from '../api/axiosConfig';
import './CategoryManager.css';

function CategoryManager({ categories, onCategoryAdded }) {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setMessage('Please enter a category name');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await apiClient.post('/categories', {
        name: categoryName,
      });

      if (response.data.success) {
        setMessage('Category added successfully!');
        setCategoryName('');
        setTimeout(() => {
          onCategoryAdded();
        }, 1000);
      } else {
        setMessage(response.data.message || 'Error adding category');
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Error adding category. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setDeleteLoading(categoryId);
      try {
        const response = await apiClient.delete(`/categories/${categoryId}`);
        if (response.data.success) {
          onCategoryAdded();
        }
      } catch (error) {
        alert('Error deleting category: ' + (error.response?.data?.message || error.message));
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  return (
    <div className="category-manager-container">
      <div className="category-form-section">
        <h2>Add New Category</h2>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name (e.g., Food, Transport, Entertainment)"
              className="category-input"
            />
            <button type="submit" className="add-btn" disabled={loading}>
              {loading ? 'Adding...' : '➕ Add Category'}
            </button>
          </div>
        </form>
      </div>

      <div className="category-list-section">
        <h2>Your Categories</h2>

        {categories.length === 0 ? (
          <div className="empty-state">
            <p>📂 No categories yet</p>
            <small>Create your first category above</small>
          </div>
        ) : (
          <div className="category-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-item">
                <span className="category-name">{category.name}</span>
                <button
                  onClick={() => handleDelete(category.id)}
                  disabled={deleteLoading === category.id}
                  className="delete-category-btn"
                >
                  {deleteLoading === category.id ? '...' : '×'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryManager;

import React, { useState } from 'react';
import apiClient from '../api/axiosConfig';
import { showSuccess, showError } from '../utils/toast';
import './AddExpense.css';

/**
 * AddExpense component - form for adding new expenses
 * Includes validation, error handling, and success notifications
 */
function AddExpense({ categories, onExpenseAdded }) {
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showError('Please fix the errors above');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/expenses', {
        category_id: parseInt(formData.categoryId),
        amount: parseFloat(formData.amount),
        description: formData.description || null,
        date: formData.date,
      });

      if (response.data.success) {
        showSuccess('Expense added successfully! 🎉');
        setFormData({
          categoryId: '',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
        });
        setTimeout(() => {
          onExpenseAdded();
        }, 500);
      } else {
        showError(response.data.message || 'Error adding expense');
      }
    } catch (error) {
      showError(
        error.response?.data?.message || 'Error adding expense. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-expense-container">
      <div className="form-header">
        <h2>➕ Add New Expense</h2>
        <p>Track your spending and stay organized</p>
      </div>

      <form onSubmit={handleSubmit} className="expense-form">
        {/* Date and Category Row */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">📅 Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'input-error' : ''}
            />
            {errors.date && <span className="error-text">❌ {errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">🏷️ Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={errors.categoryId ? 'input-error' : ''}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="error-text">❌ {errors.categoryId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="amount">💰 Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={errors.amount ? 'input-error' : ''}
            />
            {errors.amount && <span className="error-text">❌ {errors.amount}</span>}
          </div>
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label htmlFor="description">📝 Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add notes about this expense (e.g., 'Groceries from Whole Foods')"
            rows="4"
            className="expense-textarea"
          />
          <span className="char-count">{formData.description.length}/500</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-btn"
          disabled={loading || categories.length === 0}
        >
          {loading ? '⟳ Adding...' : '➕ Add Expense'}
        </button>
      </form>

      {/* Warning if no categories */}
      {categories.length === 0 && (
        <div className="warning-message">
          <span className="warning-icon">⚠️</span>
          <span>Please create categories first before adding expenses.</span>
        </div>
      )}
    </div>
  );
}

export default AddExpense;

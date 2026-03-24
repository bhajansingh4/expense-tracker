import React, { useState } from 'react';
import apiClient from '../api/axiosConfig';
import './AddExpense.css';

function AddExpense({ categories, onExpenseAdded }) {
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await apiClient.post('/expenses', {
        category_id: parseInt(formData.categoryId),
        amount: parseFloat(formData.amount),
        description: formData.description || null,
        date: formData.date,
      });

      if (response.data.success) {
        setMessage('Expense added successfully!');
        setFormData({
          categoryId: '',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
        });
        setTimeout(() => {
          onExpenseAdded();
        }, 1000);
      } else {
        setMessage(response.data.message || 'Error adding expense');
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Error adding expense. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-expense-container">
      <h2>Add New Expense</h2>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <span className="error-text">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="error-text">{errors.categoryId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.amount && <span className="error-text">{errors.amount}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add notes about this expense..."
            rows="4"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding...' : '➕ Add Expense'}
        </button>
      </form>

      {categories.length === 0 && (
        <div className="warning-message">
          ⚠️ Please create categories first before adding expenses.
        </div>
      )}
    </div>
  );
}

export default AddExpense;

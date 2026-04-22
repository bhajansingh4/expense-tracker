import React, { useState } from 'react';
import apiClient from '../api/axiosConfig';
import { showSuccess, showError } from '../utils/toast';
import './ExpenseList.css';

/**
 * ExpenseList component - displays expenses in a table with filtering, sorting, and editing
 * Features: Sort by date/amount, filter by category, search, edit, and delete expenses
 */
function ExpenseList({ expenses, categories, onExpenseDeleted }) {
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [sortBy, setSortBy] = useState('date');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Helper function to get category name
  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  // Handle delete expense
  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setDeleteLoading(expenseId);
      try {
        const response = await apiClient.delete(`/expenses/${expenseId}`);
        if (response.data.success) {
          showSuccess('Expense deleted successfully');
          onExpenseDeleted();
        }
      } catch (error) {
        showError('Error deleting expense: ' + (error.response?.data?.message || error.message));
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // Handle edit mode
  const handleEditClick = (expense) => {
    setEditingId(expense.id);
    setEditFormData({
      amount: expense.amount,
      description: expense.description,
      category_id: expense.category_id,
      date: expense.date,
    });
  };

  // Handle edit save
  const handleEditSave = async (expenseId) => {
    try {
      const response = await apiClient.put(`/expenses/${expenseId}`, {
        amount: parseFloat(editFormData.amount),
        description: editFormData.description,
        category_id: parseInt(editFormData.category_id),
        date: editFormData.date,
      });

      if (response.data.success) {
        showSuccess('Expense updated successfully');
        setEditingId(null);
        onExpenseDeleted(); // Refresh data
      }
    } catch (error) {
      showError('Error updating expense: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Sort expenses
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'amount') {
      return parseFloat(b.amount) - parseFloat(a.amount);
    }
    return 0;
  });

  // Filter and search expenses
  const filteredExpenses = sortedExpenses.filter((exp) => {
    const matchesCategory = filterCategory === 'all' || exp.category_id === parseInt(filterCategory);
    const matchesSearch =
      searchTerm === '' ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(exp.category_id).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  return (
    <div className="expense-list-container">
      {/* Controls Section */}
      <div className="expense-controls">
        <input
          type="text"
          placeholder="🔍 Search by description or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="control-select"
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="control-select"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Empty State */}
      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <p>📭 No expenses found</p>
          <small>
            {searchTerm || filterCategory !== 'all'
              ? 'Try adjusting your filters'
              : 'Start by adding a new expense'}
          </small>
        </div>
      ) : (
        <>
          {/* Summary Section */}
          <div className="expense-summary">
            <span>
              💰 Total: <strong>${totalAmount.toFixed(2)}</strong>
            </span>
            <span>
              📊 Entries: <strong>{filteredExpenses.length}</strong>
            </span>
          </div>

          {/* Table Section */}
          <div className="expense-table-wrapper">
            <div className="expense-table">
              {/* Table Header */}
              <div className="table-header">
                <div className="col-date">Date</div>
                <div className="col-category">Category</div>
                <div className="col-description">Description</div>
                <div className="col-amount">Amount</div>
                <div className="col-action">Actions</div>
              </div>

              {/* Table Rows */}
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="table-row">
                  {editingId === expense.id ? (
                    // Edit Mode
                    <>
                      <div className="col-date">
                        <input
                          type="date"
                          name="date"
                          value={editFormData.date}
                          onChange={handleEditChange}
                          className="edit-input"
                        />
                      </div>
                      <div className="col-category">
                        <select
                          name="category_id"
                          value={editFormData.category_id}
                          onChange={handleEditChange}
                          className="edit-select"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-description">
                        <input
                          type="text"
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditChange}
                          className="edit-input"
                          placeholder="Description"
                        />
                      </div>
                      <div className="col-amount">
                        <input
                          type="number"
                          name="amount"
                          value={editFormData.amount}
                          onChange={handleEditChange}
                          className="edit-input"
                          step="0.01"
                        />
                      </div>
                      <div className="col-action">
                        <button
                          onClick={() => handleEditSave(expense.id)}
                          className="save-btn"
                        >
                          ✓ Save
                        </button>
                        <button onClick={handleEditCancel} className="cancel-btn">
                          ✕ Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <div className="col-date">
                        {new Date(expense.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="col-category">
                        <span className="category-badge">
                          {getCategoryName(expense.category_id)}
                        </span>
                      </div>
                      <div className="col-description">
                        {expense.description || '-'}
                      </div>
                      <div className="col-amount">
                        <span className="amount-value">
                          ${parseFloat(expense.amount || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="col-action">
                        <button
                          onClick={() => handleEditClick(expense)}
                          className="edit-btn"
                          title="Edit expense"
                        >
                          ✎ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          disabled={deleteLoading === expense.id}
                          className="delete-btn"
                          title="Delete expense"
                        >
                          {deleteLoading === expense.id ? '⟳' : '🗑 Delete'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ExpenseList;

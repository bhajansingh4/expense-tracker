import React, { useState } from 'react';
import apiClient from '../api/axiosConfig';
import './ExpenseList.css';

function ExpenseList({ expenses, categories, onExpenseDeleted }) {
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [filterCategory, setFilterCategory] = useState('all');

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setDeleteLoading(expenseId);
      try {
        const response = await apiClient.delete(`/expenses/${expenseId}`);
        if (response.data.success) {
          onExpenseDeleted();
        }
      } catch (error) {
        alert('Error deleting expense: ' + (error.response?.data?.message || error.message));
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'amount') {
      return parseFloat(b.amount) - parseFloat(a.amount);
    }
    return 0;
  });

  const filteredExpenses = sortedExpenses.filter((exp) => {
    if (filterCategory === 'all') return true;
    return exp.category_id === parseInt(filterCategory);
  });

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  return (
    <div className="expense-list-container">
      <div className="expense-controls">
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

      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <p>📭 No expenses found</p>
          <small>Start by adding a new expense</small>
        </div>
      ) : (
        <>
          <div className="expense-summary">
            <span>Total: <strong>${totalAmount.toFixed(2)}</strong></span>
            <span>Entries: <strong>{filteredExpenses.length}</strong></span>
          </div>

          <div className="expense-table">
            <div className="table-header">
              <div className="col-date">Date</div>
              <div className="col-category">Category</div>
              <div className="col-description">Description</div>
              <div className="col-amount">Amount</div>
              <div className="col-action">Action</div>
            </div>

            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="table-row">
                <div className="col-date">
                  {new Date(expense.date).toLocaleDateString()}
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
                  ${parseFloat(expense.amount || 0).toFixed(2)}
                </div>
                <div className="col-action">
                  <button
                    onClick={() => handleDelete(expense.id)}
                    disabled={deleteLoading === expense.id}
                    className="delete-btn"
                  >
                    {deleteLoading === expense.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ExpenseList;

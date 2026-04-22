import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import ExpenseList from '../components/ExpenseList';
import ExpenseCharts from '../components/ExpenseCharts';
import AddExpense from '../components/AddExpense';
import CategoryManager from '../components/CategoryManager';
import './Dashboard.css';

/**
 * Dashboard component - main view after login
 * Displays expense summary, charts, and management tabs
 */
function Dashboard({ user, onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('expenses');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    categoryCount: 0,
    averagePerTransaction: 0,
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch expenses and categories
  const fetchData = async () => {
    setLoading(true);
    try {
      const [expensesRes, categoriesRes] = await Promise.all([
        apiClient.get('/expenses'),
        apiClient.get('/categories'),
      ]);

      if (expensesRes.data.success) {
        setExpenses(expensesRes.data.data || []);
        calculateStats(expensesRes.data.data || []);
      }

      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (expensesList) => {
    const total = expensesList.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

    const currentDate = new Date();
    const thisMonth = expensesList
      .filter((exp) => {
        const expDate = new Date(exp.date);
        return (
          expDate.getMonth() === currentDate.getMonth() &&
          expDate.getFullYear() === currentDate.getFullYear()
        );
      })
      .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

    const average = expensesList.length > 0 ? total / expensesList.length : 0;

    setStats({
      total: total.toFixed(2),
      thisMonth: thisMonth.toFixed(2),
      categoryCount: expensesList.length,
      averagePerTransaction: average.toFixed(2),
    });
  };

  // Handlers for child components
  const handleExpenseAdded = async () => {
    await fetchData();
    setActiveTab('expenses');
  };

  const handleCategoryAdded = async () => {
    await fetchData();
  };

  const handleExpenseDeleted = async () => {
    await fetchData();
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>💰 Expense Tracker Pro</h1>
            <p>Smart financial management at your fingertips</p>
          </div>
          <div className="user-section">
            <span className="user-name">Welcome, <strong>{user?.name}!</strong></span>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">💸</div>
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value">${stats.total}</div>
            <div className="stat-sublabel">All time</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-label">This Month</div>
            <div className="stat-value">${stats.thisMonth}</div>
            <div className="stat-sublabel">Current period</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-label">Transactions</div>
            <div className="stat-value">{stats.categoryCount}</div>
            <div className="stat-sublabel">Total records</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-label">Average</div>
            <div className="stat-value">${stats.averagePerTransaction}</div>
            <div className="stat-sublabel">Per transaction</div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
              onClick={() => setActiveTab('expenses')}
            >
              📊 Expenses
            </button>
            <button
              className={`tab ${activeTab === 'charts' ? 'active' : ''}`}
              onClick={() => setActiveTab('charts')}
            >
              📈 Charts
            </button>
            <button
              className={`tab ${activeTab === 'addExpense' ? 'active' : ''}`}
              onClick={() => setActiveTab('addExpense')}
            >
              ➕ Add Expense
            </button>
            <button
              className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              🏷️ Categories
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading your data...</p>
              </div>
            ) : (
              <>
                {activeTab === 'expenses' && (
                  <ExpenseList
                    expenses={expenses}
                    categories={categories}
                    onExpenseDeleted={handleExpenseDeleted}
                  />
                )}
                {activeTab === 'charts' && (
                  <ExpenseCharts expenses={expenses} categories={categories} />
                )}
                {activeTab === 'addExpense' && (
                  <AddExpense
                    categories={categories}
                    onExpenseAdded={handleExpenseAdded}
                  />
                )}
                {activeTab === 'categories' && (
                  <CategoryManager
                    categories={categories}
                    onCategoryAdded={handleCategoryAdded}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

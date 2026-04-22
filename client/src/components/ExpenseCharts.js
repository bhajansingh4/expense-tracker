import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import './ExpenseCharts.css';

/**
 * ExpenseCharts component - displays expense data visualizations
 * including pie chart for category breakdown and bar chart for monthly trends
 */
function ExpenseCharts({ expenses, categories }) {
  // Colors for pie chart
  const COLORS = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#6C5CE7',
    '#A29BFE',
    '#74B9FF',
    '#81ECEC',
    '#55EFC4',
  ];

  // Process data for pie chart (expenses by category)
  const categoryData = useMemo(() => {
    const data = {};

    expenses.forEach((expense) => {
      const category = categories.find((c) => c.id === expense.category_id);
      const categoryName = category?.name || 'Unknown';

      if (!data[categoryName]) {
        data[categoryName] = 0;
      }
      data[categoryName] += parseFloat(expense.amount || 0);
    });

    return Object.entries(data)
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses, categories]);

  // Process data for bar chart (expenses by month)
  const monthlyData = useMemo(() => {
    const data = {};
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      if (!data[monthKey]) {
        data[monthKey] = { month: monthLabel, total: 0 };
      }
      data[monthKey].total += parseFloat(expense.amount || 0);
    });

    return Object.values(data)
      .map((item) => ({
        ...item,
        total: parseFloat(item.total.toFixed(2)),
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-12); // Show last 12 months
  }, [expenses]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p className="tooltip-value">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="expense-charts-container">
      {categoryData.length > 0 && (
        <div className="chart-wrapper">
          <h3 className="chart-title">📊 Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {monthlyData.length > 0 && (
        <div className="chart-wrapper">
          <h3 className="chart-title">📈 Monthly Expenses Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
                formatter={(value) => `$${value.toFixed(2)}`}
              />
              <Legend />
              <Bar dataKey="total" fill="#667eea" name="Total Expenses" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {categoryData.length === 0 && monthlyData.length === 0 && (
        <div className="no-data">
          <p>📊 No expense data available. Add some expenses to see visualizations!</p>
        </div>
      )}
    </div>
  );
}

export default ExpenseCharts;

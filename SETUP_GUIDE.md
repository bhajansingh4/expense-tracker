# Expense Tracker - Sprint 2 Review

Complete full-stack expense tracking application with React frontend and Node.js/Express backend.

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- PostgreSQL database (credentials provided in .env)

### Backend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - `.env` file is already configured with database connection details
   - Database: `expense_tracker_e0zg` on Render PostgreSQL

3. **Database Initial Setup** (if needed)
   ```bash
   node createSchema.js
   ```

4. **Seed Database with Sample Data**
   ```bash
   node seedDatabase.js
   ```
   This creates 2 test users with sample categories and expenses.

5. **Start Backend Server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to Client Directory**
   ```bash
   cd client
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Start React Development Server**
   ```bash
   npm start
   ```
   Frontend runs on `http://localhost:3000`

## 🧪 Test Credentials

Use these credentials to test the application:

**User 1:**
- Email: `john@example.com`
- Password: `password123`

**User 2:**
- Email: `jane@example.com`
- Password: `password123`

Both users have pre-populated categories and expense records.

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### User Profile
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Categories
- `GET /api/categories` - Get all user's categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Expenses
- `GET /api/expenses` - Get all user's expenses
- `GET /api/expenses/:id` - Get specific expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## 🎨 Frontend Features

### Components Included
1. **AuthPage** - Sign up and login with form validation
2. **Dashboard** - Main application interface with stats
3. **ExpenseList** - View, sort, and filter expenses
4. **AddExpense** - Create new expense records
5. **CategoryManager** - Create and manage expense categories

### Features
- JWT-based authentication
- Responsive design for mobile and desktop
- Real-time expense filtering and sorting
- Category management
- Session persistence with localStorage
- Error handling and user feedback
- Modern UI with gradient backgrounds

## 🛠️ Technology Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router v6
- Axios for API calls
- CSS3 with modern styling

## 📁 Project Structure

```
expense-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── routes/                # API endpoints
│   ├── auth.js           # Auth routes
│   ├── users.js          # User routes
│   ├── categories.js     # Category routes
│   └── expenses.js       # Expense routes
├── middleware/           # Express middleware
├── config/              # Database config
├── database/            # Schema and migrations
├── server.js            # Main server file
├── seedDatabase.js      # Database seeding script
└── .env                 # Environment variables
```

## 🚀 Deployment Notes

The backend can be deployed to:
- Render
- Heroku
- AWS
- Google Cloud

The frontend can be deployed to:
- Vercel
- Netlify
- GitHub Pages

## 📝 Database Schema

### Tables (using exp_ prefix)
- `exp_users` - User accounts
- `exp_categories` - Expense categories (per user)
- `exp_expenses` - Expense records (per user)

All data is properly scoped to individual users with foreign key constraints.

## ✅ Testing Instructions for Demo

1. **Open the application in browser**
   - Navigate to `http://localhost:3000`

2. **Test Authentication**
   - Try signup with new credentials
   - Login with john@example.com / password123

3. **View Dashboard**
   - See total expenses, monthly total, and transaction count
   - View sample user data

4. **Test Categories**
   - Switch to Categories tab
   - View existing categories (Food, Transport, etc.)
   - Create new category

5. **Test Expenses**
   - View existing expenses with filtering
   - Add new expense
   - Sort by date and amount
   - Filter by category

6. **Test Persistence**
   - Refresh page, data persists
   - Logout and login again

## 🔒 Security Features

- JWT tokens with 7-day expiration
- Password hashing with bcryptjs
- Protected API endpoints with authentication middleware
- SQL injection prevention with parameterized queries
- CORS configuration
- User data isolation

## 📚 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start with nodemon (watch mode)
- `npm run setup-db` - Initialize database
- `node seedDatabase.js` - Seed with test data

### Frontend
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## 🎯 Sprint 2 Requirements Met

✅ React SPA created with multiple components
✅ Frontend integration with backend APIs
✅ User authentication implemented
✅ Expense management features complete
✅ Category management features complete
✅ Responsive design for mobile/desktop
✅ Professional UI with modern styling
✅ Database seeding with test data
✅ Git history with meaningful commits
✅ Code deployed and accessible locally

## 📞 Support

For technical issues, refer to:
- `server.js` - Main server configuration
- `client/src/api/axiosConfig.js` - API client setup
- `.env` - Environment variables

---

**Created:** March 24, 2026
**Author:** Bhajan Singh
**Repository:** https://github.com/bhajansingh4/expense-tracker

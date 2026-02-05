# Expense Tracker Backend - Sprint 1

A RESTful API for managing personal expenses with user authentication, built with Node.js, Express, and MySQL.

## Features

- User authentication with JWT
- Secure password hashing with bcrypt
- CRUD operations for Users, Expenses, and Categories
- Protected routes with authentication middleware
- MySQL database with relational data structure

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment configuration

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher) or MariaDB
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd expense-tracker-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update the `.env` file with your database credentials and JWT secret

4. **Create the database**
   - Log into MySQL:
     ```bash
     mysql -u root -p
     ```
   - Run the schema file:
     ```sql
     source database/schema.sql
     ```
   - Or manually execute:
     ```bash
     mysql -u root -p < database/schema.sql
     ```

5. **Start the server**
   - Development mode (with auto-restart):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### User Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/me` | Get current user profile | Yes |
| PUT | `/api/users/me` | Update user profile | Yes |
| DELETE | `/api/users/me` | Delete user account | Yes |

### Expense Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/expenses` | Get all user expenses | Yes |
| POST | `/api/expenses` | Create new expense | Yes |
| GET | `/api/expenses/:id` | Get single expense | Yes |
| PUT | `/api/expenses/:id` | Update expense | Yes |
| DELETE | `/api/expenses/:id` | Delete expense | Yes |

### Category Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | Get all user categories | Yes |
| POST | `/api/categories` | Create new category | Yes |
| PUT | `/api/categories/:id` | Update category | Yes |
| DELETE | `/api/categories/:id` | Delete category | Yes |

## API Usage Examples

### 1. Register a new user
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Create a category (requires token)
```bash
POST /api/categories
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Food"
}
```

### 4. Create an expense (requires token)
```bash
POST /api/expenses
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "category_id": 1,
  "amount": 45.50,
  "description": "Grocery shopping",
  "date": "2024-02-04"
}
```

### 5. Get all expenses (requires token)
```bash
GET /api/expenses
Authorization: Bearer <your-token>
```

## Database Schema

### Users Table
- `id` (PK)
- `name`
- `email` (unique)
- `password_hash`
- `created_at`

### Categories Table
- `id` (PK)
- `name`
- `user_id` (FK → Users.id)
- `created_at`

### Expenses Table
- `id` (PK)
- `user_id` (FK → Users.id)
- `category_id` (FK → Categories.id)
- `amount`
- `description`
- `date`
- `created_at`

## Project Structure

```
expense-tracker-backend/
├── config/
│   └── db.js              # Database connection configuration
├── database/
│   └── schema.sql         # Database schema
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── users.js           # User management routes
│   ├── expenses.js        # Expense CRUD routes
│   └── categories.js      # Category CRUD routes
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore file
├── package.json          # Project dependencies
├── server.js             # Express server setup
└── README.md             # Documentation
```

## Testing the API

You can test the API using:
- **Postman** - Import and test endpoints
- **cURL** - Command line testing
- **Thunder Client** (VS Code extension)

## Sprint 1 Deliverables (Weeks 2-4)

✅ Node.js project setup with proper structure
✅ Express server with CORS enabled
✅ MySQL database with schema
✅ User authentication (signup/login) with JWT
✅ Protected middleware for secure routes
✅ Complete CRUD operations for:
  - Users
  - Expenses
  - Categories
✅ Proper error handling
✅ Environment variable configuration

## Live Demo Preparation

Before your Week 4 demo, ensure:
1. ✅ All code is pushed to GitHub
2. ✅ `.env` file is configured correctly
3. ✅ Database is created and schema is applied
4. ✅ Server starts without errors
5. ✅ You can demonstrate:
   - User signup/login
   - Creating a category
   - Creating an expense
   - Viewing all expenses

## Common Commands

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start

# Test database connection
mysql -u root -p expense_tracker
```

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check credentials in `.env` file
- Ensure database exists: `CREATE DATABASE expense_tracker;`

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 5000

### Module Not Found
- Run `npm install` to install all dependencies

## Author

[Your Name]

## License

ISC

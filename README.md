# Expense Tracker API

A RESTful API backend for tracking personal expenses with user authentication, category management, and complete CRUD operations.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Deployment](#deployment)

## Features

✅ **User Authentication** - Secure signup and login with JWT tokens  
✅ **Password Hashing** - Bcryptjs for secure password storage  
✅ **Protected Routes** - JWT middleware for secure endpoints  
✅ **Expense Management** - Full CRUD operations for expenses  
✅ **Category Management** - Organize expenses by categories  
✅ **User Profile** - View and update user information  
✅ **Data Relationships** - One-to-Many relationships using Foreign Keys  
✅ **Input Validation** - Comprehensive request validation  
✅ **Error Handling** - Consistent error response format  
✅ **Database Indexing** - Optimized queries with proper indexes  

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **CORS:** Enabled for cross-origin requests
- **Environment:** dotenv for configuration management

## Project Structure

```
expense-tracker/
├── config/
│   └── db.js                    # PostgreSQL connection pool
├── database/
│   └── schema.sql              # Database schema with seed data
├── middleware/
│   └── auth.js                 # JWT authentication middleware
├── routes/
│   ├── auth.js                 # Authentication endpoints
│   ├── users.js                # User management endpoints
│   ├── categories.js           # Category management endpoints
│   └── expenses.js             # Expense CRUD endpoints
├── server.js                   # Express server configuration
├── package.json                # Project dependencies
├── .env                        # Environment variables (not in repo)
├── .env.example                # Environment template
├── Postman_Collection.json     # API documentation & testing
└── README.md                   # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd expense-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

4. **Create the database**
```bash
# Connect to PostgreSQL and run:
# CREATE DATABASE expense_tracker_4mxx;
```

5. **Initialize the database schema**
```bash
# Run schema.sql to create tables and insert sample data
psql -U your_user -d expense_tracker_4mxx -f database/schema.sql
```

6. **Start the development server**
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DB_HOST=your_database_host
DB_PORT=5432
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## API Endpoints

### Base URL
```
http://localhost:5000
```

### HTTP Status Codes

- `200 OK` - Successful GET/PUT/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Authentication Endpoints (Public)

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### User Endpoints (Protected)

All user endpoints require the `Authorization` header with a valid JWT token.

#### Get Current User Profile
```http
GET /api/users/me
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-02-25T10:00:00.000Z"
  }
}
```

#### Update User Profile
```http
PUT /api/users/me
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "created_at": "2026-02-25T10:00:00.000Z"
  }
}
```

#### Delete User Account
```http
DELETE /api/users/me
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### Category Endpoints (Protected)

#### Get All Categories
```http
GET /api/categories
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Food",
      "user_id": 1,
      "created_at": "2026-02-25T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Create Category
```http
POST /api/categories
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Entertainment"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 3,
    "name": "Entertainment",
    "user_id": 1,
    "created_at": "2026-02-25T10:02:00.000Z"
  }
}
```

#### Update Category
```http
PUT /api/categories/1
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Dining"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": 1,
    "name": "Dining",
    "user_id": 1,
    "created_at": "2026-02-25T10:00:00.000Z"
  }
}
```

#### Delete Category
```http
DELETE /api/categories/1
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Note:** Cannot delete a category that has associated expenses.

### Expense Endpoints (Protected)

#### Get All Expenses
```http
GET /api/expenses
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "category_id": 1,
      "amount": "50.50",
      "description": "Lunch at restaurant",
      "date": "2026-02-25",
      "created_at": "2026-02-25T10:00:00.000Z",
      "category_name": "Food"
    }
  ],
  "count": 1
}
```

#### Get Expense by ID
```http
GET /api/expenses/1
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "category_id": 1,
    "amount": "50.50",
    "description": "Lunch at restaurant",
    "date": "2026-02-25",
    "created_at": "2026-02-25T10:00:00.000Z",
    "category_name": "Food"
  }
}
```

#### Create Expense
```http
POST /api/expenses
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "category_id": 1,
  "amount": 75.50,
  "description": "Dinner at restaurant",
  "date": "2026-02-25"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "id": 2,
    "user_id": 1,
    "category_id": 1,
    "amount": "75.50",
    "description": "Dinner at restaurant",
    "date": "2026-02-25",
    "created_at": "2026-02-25T10:05:00.000Z",
    "category_name": "Food"
  }
}
```

#### Update Expense
```http
PUT /api/expenses/1
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "amount": 60.00,
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Expense updated successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "category_id": 1,
    "amount": "60.00",
    "description": "Updated description",
    "date": "2026-02-25",
    "created_at": "2026-02-25T10:00:00.000Z",
    "category_name": "Food"
  }
}
```

#### Delete Expense
```http
DELETE /api/expenses/1
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

## Authentication

### How JWT Authentication Works

1. **Registration/Login**: User provides credentials and receives a JWT token
2. **Token Storage**: Client stores the token (usually in localStorage or sessionStorage)
3. **API Requests**: Include token in the `Authorization` header as `Bearer <token>`
4. **Verification**: Server verifies token before processing protected routes

### Example Header
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsImlhdCI6MTY0NTA2NjQ2MCwiZXhwIjoxNjQ1MTUyODYwfQ.xyz
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Expenses Table
```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

### Data Relationships
- **One User → Many Categories** (1:M)
- **One Category → Many Expenses** (1:M)  
- **One User → Many Expenses** (1:M)

## Error Handling

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input provided"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error during operation"
}
```

## Testing with Postman

1. **Import Collection**
   - Open Postman
   - Import `Postman_Collection.json` file

2. **Set Variables**
   - Set `BASE_URL` to your API URL
   - After login, update `TOKEN` with received JWT

3. **Test Endpoints**
   - Run requests in collections to test each endpoint

## Deployment

### Deploy to Render

1. **Create Render Account** - Sign up at [render.com](https://render.com)

2. **Connect GitHub Repository** - Authorize Render to access your GitHub

3. **Create Web Service**
   - Select your repository
   - Set Runtime: Node
   - Set Build Command: `npm install`
   - Set Start Command: `npm start`

4. **Add Environment Variables**
   - Go to Environment section
   - Add all variables from `.env` file

5. **Deploy**
   - Render will automatically deploy on Git pushes
   - Your API will be available at: `https://your-app.onrender.com`

### Database Hosting

- **Render PostgreSQL** - Managed database service
- **Aiven** - PostgreSQL hosting
- **PlanetScale** - MySQL hosting

## Security Best Practices

✅ Passwords hashed with bcryptjs (10 salt rounds)  
✅ JWT tokens with 7-day expiration  
✅ Input validation on all endpoints  
✅ Protected routes with middleware  
✅ CORS enabled for cross-origin requests  
✅ Environment variables for sensitive data  
✅ SQL injection prevention with parameterized queries  

## Commit History

All development commits are tracked in the Git repository:

```bash
git log --oneline
```

## Phase 1 Deliverables

✅ RESTful API with Node.js & Express  
✅ PostgreSQL relational database  
✅ 3 Entities: Users, Expenses, Categories  
✅ Proper Foreign Key relationships  
✅ JWT authentication & authorization  
✅ Password hashing with bcryptjs  
✅ Complete CRUD endpoints  
✅ Proper HTTP status codes  
✅ Input validation & error handling  
✅ Postman collection documentation  
✅ Deployed live API  

## Support

For questions or issues, refer to the course materials or contact your instructor.

## License

This project is part of the OpenSource Full Stack Development Course.

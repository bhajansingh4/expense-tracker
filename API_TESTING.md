# API Testing Guide

This document provides sample requests for testing all API endpoints.

## Base URL
```
http://localhost:5000
```

---

## Authentication Endpoints

### 1. Register New User
**POST** `/api/auth/signup`

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securepass123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
}
```

---

### 2. Login
**POST** `/api/auth/login`

**Request:**
```json
{
  "email": "jane@example.com",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
}
```

---

## User Endpoints (All require Bearer token)

### 3. Get Current User Profile
**GET** `/api/users/me`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "created_at": "2024-02-04T12:00:00.000Z"
  }
}
```

---

### 4. Update User Profile
**PUT** `/api/users/me`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "created_at": "2024-02-04T12:00:00.000Z"
  }
}
```

---

### 5. Delete User Account
**DELETE** `/api/users/me`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Response (200):**
```json
{
  "message": "Account deleted successfully"
}
```

---

## Category Endpoints (All require Bearer token)

### 6. Get All Categories
**GET** `/api/categories`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Response (200):**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Food",
      "user_id": 1,
      "created_at": "2024-02-04T12:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Transportation",
      "user_id": 1,
      "created_at": "2024-02-04T12:05:00.000Z"
    }
  ]
}
```

---

### 7. Create New Category
**POST** `/api/categories`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Request:**
```json
{
  "name": "Entertainment"
}
```

**Response (201):**
```json
{
  "message": "Category created successfully",
  "category": {
    "id": 3,
    "name": "Entertainment",
    "user_id": 1,
    "created_at": "2024-02-04T12:10:00.000Z"
  }
}
```

---

### 8. Update Category
**PUT** `/api/categories/:id`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Request:**
```json
{
  "name": "Movies & Entertainment"
}
```

**Response (200):**
```json
{
  "message": "Category updated successfully",
  "category": {
    "id": 3,
    "name": "Movies & Entertainment",
    "user_id": 1,
    "created_at": "2024-02-04T12:10:00.000Z"
  }
}
```

---

### 9. Delete Category
**DELETE** `/api/categories/:id`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Response (200):**
```json
{
  "message": "Category deleted successfully"
}
```

---

## Expense Endpoints (All require Bearer token)

### 10. Get All Expenses
**GET** `/api/expenses`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Response (200):**
```json
{
  "expenses": [
    {
      "id": 1,
      "user_id": 1,
      "category_id": 1,
      "amount": "45.50",
      "description": "Grocery shopping",
      "date": "2024-02-04",
      "created_at": "2024-02-04T12:00:00.000Z",
      "category_name": "Food"
    },
    {
      "id": 2,
      "user_id": 1,
      "category_id": 2,
      "amount": "15.00",
      "description": "Bus fare",
      "date": "2024-02-03",
      "created_at": "2024-02-03T08:30:00.000Z",
      "category_name": "Transportation"
    }
  ]
}
```

---

### 11. Get Single Expense
**GET** `/api/expenses/:id`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Response (200):**
```json
{
  "expense": {
    "id": 1,
    "user_id": 1,
    "category_id": 1,
    "amount": "45.50",
    "description": "Grocery shopping",
    "date": "2024-02-04",
    "created_at": "2024-02-04T12:00:00.000Z",
    "category_name": "Food"
  }
}
```

---

### 12. Create New Expense
**POST** `/api/expenses`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Request:**
```json
{
  "category_id": 1,
  "amount": 32.99,
  "description": "Lunch at restaurant",
  "date": "2024-02-04"
}
```

**Response (201):**
```json
{
  "message": "Expense created successfully",
  "expense": {
    "id": 3,
    "user_id": 1,
    "category_id": 1,
    "amount": "32.99",
    "description": "Lunch at restaurant",
    "date": "2024-02-04",
    "created_at": "2024-02-04T13:00:00.000Z",
    "category_name": "Food"
  }
}
```

---

### 13. Update Expense
**PUT** `/api/expenses/:id`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Request:**
```json
{
  "amount": 35.99,
  "description": "Lunch at restaurant (updated)"
}
```

**Response (200):**
```json
{
  "message": "Expense updated successfully",
  "expense": {
    "id": 3,
    "user_id": 1,
    "category_id": 1,
    "amount": "35.99",
    "description": "Lunch at restaurant (updated)",
    "date": "2024-02-04",
    "created_at": "2024-02-04T13:00:00.000Z",
    "category_name": "Food"
  }
}
```

---

### 14. Delete Expense
**DELETE** `/api/expenses/:id`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Response (200):**
```json
{
  "message": "Expense deleted successfully"
}
```

---

## Testing Workflow

### Step-by-step testing sequence:

1. **Register a new user** (POST /api/auth/signup)
2. **Login** (POST /api/auth/login) - Save the token
3. **Create categories** (POST /api/categories)
   - Food
   - Transportation
   - Entertainment
4. **Get all categories** (GET /api/categories)
5. **Create expenses** (POST /api/expenses)
6. **Get all expenses** (GET /api/expenses)
7. **Update an expense** (PUT /api/expenses/:id)
8. **Delete an expense** (DELETE /api/expenses/:id)
9. **Get user profile** (GET /api/users/me)

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

### 404 Not Found
```json
{
  "message": "Expense not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

---

## cURL Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Expense (with token)
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "category_id": 1,
    "amount": 25.50,
    "description": "Coffee",
    "date": "2024-02-04"
  }'
```

### Get All Expenses
```bash
curl -X GET http://localhost:5000/api/expenses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

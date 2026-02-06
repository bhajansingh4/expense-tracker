-- Create Database (Run manually: CREATE DATABASE expense_tracker_4mxx;)
-- Use expense_tracker_4mxx;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
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

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

-- Dummy Data
-- Insert sample users (password: "password123")
INSERT INTO users (id, name, email, password_hash) VALUES 
(1, 'John Doe', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Pq'),
(2, 'Jane Smith', 'jane@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Pq'),
(3, 'Bob Johnson', 'bob@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Pq')
ON CONFLICT (email) DO NOTHING;

-- Reset sequence for users
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users) + 1);

-- Insert sample categories
INSERT INTO categories (id, user_id, name) VALUES 
(1, 1, 'Food'),
(2, 1, 'Transport'),
(3, 1, 'Entertainment'),
(4, 1, 'Utilities'),
(5, 2, 'Food'),
(6, 2, 'Health'),
(7, 3, 'Shopping'),
(8, 3, 'Bills')
ON CONFLICT DO NOTHING;

-- Reset sequence for categories
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories) + 1);

-- Insert sample expenses
INSERT INTO expenses (id, user_id, category_id, amount, description, date) VALUES 
(1, 1, 1, 50.00, 'Lunch at restaurant', '2026-02-01'),
(2, 1, 2, 30.00, 'Taxi fare', '2026-02-02'),
(3, 1, 3, 100.00, 'Movie tickets', '2026-02-03'),
(4, 1, 4, 120.00, 'Electricity bill', '2026-02-04'),
(5, 1, 1, 45.00, 'Groceries', '2026-02-05'),
(6, 2, 5, 60.00, 'Dinner', '2026-02-01'),
(7, 2, 6, 80.00, 'Doctor visit', '2026-02-02'),
(8, 3, 7, 250.00, 'Clothes shopping', '2026-02-03'),
(9, 3, 8, 150.00, 'Internet bill', '2026-02-04')
ON CONFLICT DO NOTHING;

-- Reset sequence for expenses
SELECT setval('expenses_id_seq', (SELECT MAX(id) FROM expenses) + 1);

# QUICK START GUIDE - Sprint 1 Backend

## Prerequisites Check
- [ ] Node.js installed (v14+)
- [ ] MySQL or MariaDB installed and running
- [ ] Git installed

## Setup Steps (5 minutes)

### 1. Navigate to Project
```bash
cd expense-tracker-backend
```

### 2. Install Dependencies
```bash
npm install
```
This will install: express, mysql2, dotenv, bcryptjs, jsonwebtoken, cors, and nodemon

### 3. Configure Environment
```bash
# The .env file is already created, just update these values:
# - DB_PASSWORD: your MySQL root password
# - JWT_SECRET: change to a secure random string
```

Edit `.env` file:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE  ← Change this
DB_NAME=expense_tracker
JWT_SECRET=change_this_to_a_secure_random_string  ← Change this
```

### 4. Create Database
```bash
# Option A: Using MySQL command line
mysql -u root -p < database/schema.sql

# Option B: Log into MySQL and run:
mysql -u root -p
> source database/schema.sql;
> exit;

# Option C: Manually in MySQL:
mysql -u root -p
> CREATE DATABASE expense_tracker;
> USE expense_tracker;
# Then copy/paste the contents of database/schema.sql
```

### 5. Start the Server
```bash
# Development mode (auto-restarts on changes)
npm run dev

# OR production mode
npm start
```

You should see: `Server is running on port 5000`

### 6. Test the API
Open a new terminal and test:
```bash
# Test 1: Health check
curl http://localhost:5000

# Test 2: Register a user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'

# You should get back a token!
```

## Live Demo Preparation

Before Week 4 Dev Day:

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Sprint 1: Complete backend implementation"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Update SUBMISSION.txt**
- Add your GitHub repo URL
- Add your name
- Review the checklist

3. **Practice Demo**
- Start your server
- Show signup/login in Postman or browser
- Create a category
- Create an expense
- Show all expenses

## Demo Talking Points

**"Show me where you defined your routes"**
→ Point to `/routes` folder, explain each file

**"How does authentication work?"**
→ Show `/middleware/auth.js`, explain JWT token verification

**"Show your database structure"**
→ Open `/database/schema.sql`, explain relationships

## Common Issues & Fixes

### Error: "Cannot connect to database"
- Check MySQL is running: `sudo systemctl status mysql`
- Verify credentials in `.env`
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Error: "Port 5000 already in use"
- Change PORT in `.env` to 5001 or another port
- Or kill existing process: `lsof -ti:5000 | xargs kill`

### Error: "Module not found"
- Run `npm install` again
- Delete `node_modules` and run `npm install`

## File Structure Overview

```
expense-tracker-backend/
├── config/
│   └── db.js              ← Database connection
├── database/
│   └── schema.sql         ← Create tables here
├── middleware/
│   └── auth.js            ← JWT protection
├── routes/
│   ├── auth.js            ← Signup/Login
│   ├── users.js           ← User CRUD
│   ├── expenses.js        ← Expense CRUD
│   └── categories.js      ← Category CRUD
├── .env                   ← Configuration (UPDATE THIS)
├── server.js              ← Main entry point
└── package.json           ← Dependencies
```

## Success Checklist

Before your demo, verify:
- [ ] `npm install` completed without errors
- [ ] `.env` configured with your MySQL password
- [ ] Database created and schema applied
- [ ] `npm start` runs without errors
- [ ] Can access http://localhost:5000
- [ ] Can signup a new user via Postman/curl
- [ ] Can login and receive a token
- [ ] Code is pushed to GitHub
- [ ] SUBMISSION.txt updated with repo URL

## Need Help?

Check these files:
- `README.md` - Full documentation
- `API_TESTING.md` - All API endpoints with examples
- `database/schema.sql` - Database structure

Good luck with your demo! 🚀

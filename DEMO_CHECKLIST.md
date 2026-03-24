# DEMO CHECKLIST - Sprint 2 Review

## Pre-Demo Setup (Do This Before Class)

### 1. Backend Setup
```bash
cd "d:\Fourth_sem\Paid\Full stake\expense-tracker"
npm install
node seedDatabase.js
npm start
```
- Server should run on: http://localhost:5000
- Check if API responds: http://localhost:5000/ (should show success message)

### 2. Frontend Setup (In New Terminal)
```bash
cd "d:\Fourth_sem\Paid\Full stake\expense-tracker\client"
npm install
npm start
```
- Frontend should open: http://localhost:3000
- Should redirect to authentication page

---

## Demo Flow (5-10 minutes)

### 1. Show Application (2 min)
- [ ] Open browser to http://localhost:3000
- [ ] Show login/signup forms
- Point out: "This is the authentication component with form validation"

### 2. Login with Test User (1 min)
- [ ] Click Sign In
- [ ] Enter: john@example.com / password123
- [ ] Explain: "JWT token is stored in localStorage for session persistence"

### 3. Show Dashboard (2 min)
- [ ] Display dashboard with stats cards
- [ ] Explain stats: "Total expenses, this month, transaction count"
- [ ] Show responsive design (open DevTools, resize)

### 4. Demonstrate Features (3 min)

**Categories Tab:**
- [ ] Show list of pre-created categories
- [ ] Add new category (e.g., "Entertainment")
- [ ] Explain: "Categories are user-specific, stored in database"

**Expenses Tab:**
- [ ] Show list of expenses with sorting/filtering
- [ ] Sort by date, then by amount
- [ ] Filter by specific category
- [ ] Point out: "Each expense shows date, category badge, amount"

**Add Expense Tab:**
- [ ] Create new expense entry
  - Select category: Food & Dining
  - Amount: 35.50
  - Date: Today
  - Description: "Lunch meeting"
- [ ] Submit and watch it appear in expense list
- [ ] Explain: "Data persists immediately"

### 5. Logout and Verify (30 sec)
- [ ] Click Logout
- [ ] Confirm redirected to login page
- [ ] Show localStorage is cleared (DevTools → Application)

### 6. Login Again (30 sec)
- [ ] Login as jane@example.com / password123
- [ ] Show different data for different user
- Explain: "Each user has isolated data"

---

## Key Points to Mention

### Technical Understanding Questions (Prepare these answers)

**Q: How does authentication work?**
A: "We use JWT tokens. After login, the token is stored in localStorage. It's added to every API request header. The backend middleware validates it."

**Q: How is data structured?**
A: "We have three main tables: users, categories, and expenses. Foreign keys ensure data integrity. User_id on categories and expenses ensures data isolation."

**Q: How do you prevent SQL injection?**
A: "We use parameterized queries. Values are passed as $1, $2 placeholders, never concatenated into strings."

**Q: Walk me through adding an expense.**
A: "Click Add Expense → select category → enter amount → pick date → add description → submit. Frontend validates input, calls POST /api/expenses, backend saves to DB, returns new expense, frontend updates list."

---

## Files to Highlight During Demo

When asked "Show me where you defined routes":
- Open: `routes/expenses.js` (Show POST, GET, PUT, DELETE endpoints)

When asked about components:
- Show: `client/src/components/` (ExpenseList.js, AddExpense.js, CategoryManager.js)

When asked about database:
- Show: `.env` (Database connection)
- Explain: Tables created with prefix `exp_` (tables: exp_users, exp_categories, exp_expenses)

When asked about styling:
- Point to: `client/src/pages/Dashboard.css` (Component-scoped styling)
- Mention: Linear gradients, responsive grid layout, mobile breakpoints

---

## Git History to Show

```bash
git log --oneline
```

Show these commits:
1. "Sprint 2: React Frontend with Components and Database Seeding"
2. "Update API routes to use exp_ prefixed tables and seed database"
3. Earlier commits from Sprint 1 backend

Explain: "We have a healthy git history with meaningful commit messages showing development progression."

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 already in use | `Get-NetTcpConnection -LocalPort 5000` and stop the process |
| Port 3000 already in use | Kill process or use different port: `PORT=3001 npm start` |
| Database connection fails | Check .env file has correct credentials |
| Modules not found | Run `npm install` in both root and `client/` directories |
| Cannot find React | Install in client folder: `cd client && npm install` |

---

## Demo Success Criteria

✅ Application starts without errors
✅ Can login with test credentials
✅ Dashboard displays with real data
✅ Can create categories
✅ Can add and view expenses
✅ Sorting/filtering works
✅ Data persists across sessions
✅ Can demonstrate code files
✅ Explain technical decisions confidently

---

**Repository:** https://github.com/bhajansingh4/expense-tracker
**Demo Date:** March 27, 2026 (Thurs)
**Duration:** 5-10 minutes

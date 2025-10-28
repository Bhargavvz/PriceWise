# Quick Start Commands

## Prerequisites Check
```bash
# Check Node.js version (should be 16+)
node --version

# Check npm version
npm --version

# Check PostgreSQL (should be running)
pg_isready
```

## Database Setup (One-time)

```bash
# 1. Create database (using psql)
psql -U postgres
CREATE DATABASE pricewise;
\q

# OR using pgAdmin - create database named "pricewise"
```

## Backend Setup & Start

```bash
# Navigate to backend
cd backend

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

✅ Backend running on http://localhost:5000

## Frontend Start

```bash
# Open NEW terminal, navigate to frontend
cd frontend

# Start frontend dev server
npm run dev
```

✅ Frontend running on http://localhost:5173

## Access the Application

1. Open browser: http://localhost:5173
2. Login with demo account:
   - Email: `john@example.com`
   - Password: `password123`

## Test Features

- ✅ Search for products
- ✅ View product prices across stores
- ✅ Create shopping lists
- ✅ View deals and sales
- ✅ See analytics dashboard
- ✅ Find stores on map
- ✅ Toggle dark mode

## Common Issues

**Cannot connect to database?**
```bash
# Check PostgreSQL is running
# Windows: Check Services
# Mac: brew services list

# Verify .env file has correct DATABASE_URL
```

**Port already in use?**
```bash
# Kill process on port 5000 (backend)
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -ti:5000 | xargs kill

# Or change port in backend/.env
```

**Module not found?**
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

## Stop Servers

- Press `Ctrl + C` in both terminal windows

---

That's it! You're ready to use PriceWise! 🎉

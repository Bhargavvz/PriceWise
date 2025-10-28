# PriceWise Setup Guide

## Quick Start

### Step 1: Install PostgreSQL

Download and install PostgreSQL from: https://www.postgresql.org/download/

During installation:
- Set a password for the postgres user (remember this!)
- Keep the default port (5432)

### Step 2: Create Database

Open pgAdmin or use command line:

```sql
CREATE DATABASE pricewise;
```

### Step 3: Configure Backend

1. Navigate to the `backend` folder
2. Copy `.env.example` to `.env`
3. Update the `.env` file with your PostgreSQL password:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/pricewise
```

### Step 4: Install Dependencies

Already done! ✅

### Step 5: Seed Database

From the `backend` folder, run:

```bash
npm run seed
```

This will:
- Create all database tables
- Add sample stores
- Add sample products
- Add price data
- Create demo users

### Step 6: Start the Application

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

Backend will run on http://localhost:5000

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Frontend will run on http://localhost:5173

### Step 7: Login

Use these demo credentials:
- Email: john@example.com
- Password: password123

## Troubleshooting

### Database Connection Error

If you see "database connection error":
1. Make sure PostgreSQL is running
2. Check your DATABASE_URL in `.env`
3. Verify the database exists: `psql -U postgres -l`

### Port Already in Use

If port 5000 or 5173 is already in use:
- Backend: Change PORT in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

### Module Not Found

Run `npm install` in both backend and frontend folders.

## Features to Try

1. **Search Products** - Use the search bar on the homepage
2. **View Deals** - Click "Deals" in the navigation
3. **Compare Prices** - Search for a product and compare across stores
4. **Create Shopping List** - Login and go to "My Lists"
5. **View Dashboard** - See your savings and analytics
6. **Find Stores** - View stores on the map
7. **Toggle Dark Mode** - Click the moon/sun icon

## Next Steps

- Customize the seed data in `backend/seeders/seed.js`
- Add your own products and stores
- Configure location services for your area
- Deploy to production (see deployment guide)

Enjoy using PriceWise! 🛒💰

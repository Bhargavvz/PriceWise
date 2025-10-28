# 🚀 PriceWise - Final Setup & Running Instructions

## ✅ What Has Been Built

A complete full-stack grocery price comparison application with:
- **Backend API** (Node.js + Express + PostgreSQL)
- **Frontend** (React + Vite)
- **Database Schema** with sample data
- **30+ API endpoints**
- **8 complete pages**
- **Full authentication system**
- **Price optimization algorithm**
- **Interactive maps**
- **Analytics dashboard**
- **Dark mode**
- **Responsive design**

## 📋 Prerequisites

Before running the application, make sure you have:

1. ✅ **Node.js** (v16 or higher) - Already installed
2. ✅ **npm** - Already installed
3. ⚠️ **PostgreSQL** (v12 or higher) - **YOU NEED TO INSTALL THIS**

## 🗄️ Step 1: Install PostgreSQL

### Windows:
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation:
   - Set password for `postgres` user (e.g., "password")
   - Keep default port: **5432**
   - Remember your password!

### Verify PostgreSQL Installation:
```bash
# Check if PostgreSQL is running
pg_isready

# Or check version
psql --version
```

## 🔧 Step 2: Create Database

### Option A: Using pgAdmin (GUI)
1. Open pgAdmin (installed with PostgreSQL)
2. Connect to PostgreSQL server
3. Right-click "Databases" → "Create" → "Database"
4. Name: `pricewise`
5. Click "Save"

### Option B: Using Command Line
```bash
# Windows (PowerShell or CMD)
psql -U postgres

# In psql prompt:
CREATE DATABASE pricewise;
\q
```

## ⚙️ Step 3: Configure Backend

1. Open `backend/.env` file (already created)
2. Update the `DATABASE_URL` with your PostgreSQL password:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/pricewise
JWT_SECRET=pricewise_secret_key_change_in_production_2025
JWT_EXPIRE=7d
```

**Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation!**

## 🌱 Step 4: Seed Database (Initialize with Sample Data)

Open a terminal in the **backend** folder:

```bash
cd backend
npm run seed
```

You should see:
```
🌱 Starting database seeding...
✅ Schema created successfully
✅ Users seeded
✅ Stores seeded
✅ Products seeded
✅ Prices seeded
✅ Historical prices seeded
🎉 Database seeding completed successfully!

📝 Test credentials:
   Email: john@example.com
   Password: password123
```

## 🎯 Step 5: Run the Application

### Terminal 1 - Backend Server

```bash
# Make sure you're in the backend folder
cd backend

# Start the backend server
npm run dev
```

You should see:
```
🚀 Server running on port 5000 in development mode
📍 API available at http://localhost:5000/api
Database connected successfully
```

**Leave this terminal running!**

### Terminal 2 - Frontend Server

Open a **NEW terminal** window:

```bash
# Navigate to frontend folder
cd frontend

# Start the frontend dev server
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Leave this terminal running too!**

## 🌐 Step 6: Access the Application

1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see the PriceWise homepage!

## 🔐 Step 7: Login

Use the demo account:
- **Email**: `john@example.com`
- **Password**: `password123`

## ✨ Step 8: Explore Features

Try these features:

1. **Search Products**
   - Use the search bar on homepage
   - Try searching: "milk", "bread", "eggs"

2. **View Deals**
   - Click "Deals" in navigation
   - See products on sale

3. **Compare Prices**
   - Search for a product
   - See prices from different stores

4. **Create Shopping List**
   - Login first
   - Go to "My Lists"
   - Click "Create List"

5. **View Dashboard**
   - Click "Dashboard" after login
   - See your analytics and savings

6. **Find Stores**
   - Click "Stores" in navigation
   - View stores on interactive map

7. **Toggle Dark Mode**
   - Click the moon/sun icon in navbar

## 🔍 Troubleshooting

### Database Connection Error

**Error**: "database connection error"

**Solution**:
1. Check PostgreSQL is running
2. Verify `DATABASE_URL` in `backend/.env`
3. Make sure database `pricewise` exists
4. Check username and password are correct

### Port Already in Use

**Error**: "Port 5000 is already in use"

**Solution**:
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
# Note the PID and kill it
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

### Module Not Found

**Error**: "Cannot find module..."

**Solution**:
```bash
# Reinstall dependencies
cd backend
npm install

cd ../frontend
npm install
```

### Blank Page / White Screen

**Solution**:
1. Check browser console for errors (F12)
2. Make sure backend is running
3. Check frontend `.env` has correct API URL
4. Try hard refresh (Ctrl + F5)

## 📊 API Testing

Test the backend API directly:

```bash
# Health check
curl http://localhost:5000/api/health

# Search products
curl "http://localhost:5000/api/products/search?q=milk"

# Get categories
curl http://localhost:5000/api/products/categories

# Get sale items
curl http://localhost:5000/api/prices/sales
```

## 🛑 How to Stop

To stop the servers:
1. Go to each terminal
2. Press `Ctrl + C`

## 📱 Mobile Testing

The app is fully responsive! Test it:
1. Open browser DevTools (F12)
2. Click device toolbar icon
3. Select a mobile device
4. Test all features

## 🎨 What You'll See

### Homepage
- Beautiful hero section
- Search bar
- Featured deals
- Popular products

### Dashboard (after login)
- Savings statistics
- Shopping list count
- Items tracked
- Price trend charts
- Category analysis

### Search Page
- Product search
- Filters (category, brand, dietary)
- Product cards with prices

### Stores Page
- Interactive map
- Store markers
- Store details
- Contact information

### Shopping Lists
- Create/edit/delete lists
- Add products
- Optimize for best prices

## 📝 Next Steps

1. **Explore the codebase**
   - Check `backend/controllers` for API logic
   - Look at `frontend/src/pages` for UI components

2. **Customize data**
   - Edit `backend/seeders/seed.js` to add your own products/stores

3. **Add features**
   - See `PROJECT_SUMMARY.md` for enhancement ideas

4. **Deploy to production**
   - Backend: Railway, Render, or Heroku
   - Frontend: Vercel, Netlify, or Cloudflare Pages
   - Database: Railway, Supabase, or Neon

## 🎉 Success!

If you can:
- ✅ See the homepage
- ✅ Login successfully
- ✅ Search for products
- ✅ View the dashboard

**Congratulations! Your PriceWise application is fully functional!** 🎊

## 📚 Documentation

- **README.md** - Full documentation
- **SETUP.md** - Detailed setup guide
- **API_TESTING.md** - API endpoint testing
- **PROJECT_SUMMARY.md** - Complete project overview

## 🆘 Need Help?

Check the documentation files or review the error messages carefully. Most issues are related to:
1. PostgreSQL not running
2. Wrong database credentials
3. Ports already in use
4. Missing dependencies

---

**Enjoy your PriceWise application!** 🛒💰

Made with ❤️ using React, Node.js, Express, and PostgreSQL

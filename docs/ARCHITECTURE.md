# PriceWise - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                     http://localhost:5173                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    FRONTEND (React + Vite)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Pages     │  │  Components  │  │   Contexts   │           │
│  │             │  │              │  │              │           │
│  │ - Home      │  │ - Navbar     │  │ - Auth       │           │
│  │ - Search    │  │ - Cards      │  │ - Theme      │           │
│  │ - Dashboard │  │ - Spinner    │  │ - Toast      │           │
│  │ - Lists     │  │              │  │              │           │
│  └─────────────┘  └──────────────┘  └──────────────┘           │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐           │
│  │         Services (API Integration)               │           │
│  │  - Auth  - Products  - Prices  - Stores         │           │
│  └──────────────────────────────────────────────────┘           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Axios HTTP Client
                            │ JWT Token
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                 BACKEND (Node.js + Express)                      │
│                   http://localhost:5000/api                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐           │
│  │              Middleware Layer                    │           │
│  │  - CORS  - Helmet  - Rate Limit  - Auth         │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Routes    │  │ Controllers  │  │    Models    │           │
│  │             │  │              │  │              │           │
│  │ /auth       │  │ authCtrl     │  │ User         │           │
│  │ /products   │  │ productCtrl  │  │ Product      │           │
│  │ /prices     │  │ priceCtrl    │  │ Price        │           │
│  │ /stores     │  │ storeCtrl    │  │ Store        │           │
│  │ /lists      │  │ listCtrl     │  │ ShoppingList │           │
│  │ /analytics  │  │ analyticsCtrl│  │              │           │
│  └─────────────┘  └──────────────┘  └──────────────┘           │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐           │
│  │         Business Logic & Algorithms              │           │
│  │  - Price Optimization                            │           │
│  │  - Distance Calculation (Haversine)              │           │
│  │  - Price History Analysis                        │           │
│  └──────────────────────────────────────────────────┘           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ pg (PostgreSQL Client)
                            │ SQL Queries
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                  DATABASE (PostgreSQL)                           │
│                   postgresql://localhost:5432/pricewise          │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  users   │  │ products │  │  stores  │  │  prices  │       │
│  │          │  │          │  │          │  │          │       │
│  │ - id     │  │ - id     │  │ - id     │  │ - id     │       │
│  │ - email  │  │ - name   │  │ - name   │  │ - price  │       │
│  │ - pass   │  │ - cat    │  │ - lat    │  │ - date   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │shopping_lists│  │  list_items  │  │price_alerts  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Authentication Flow
```
User → Login Form → POST /api/auth/login → Verify Password
→ Generate JWT → Return Token → Store in LocalStorage
→ Include in Headers → Protected Routes
```

### 2. Product Search Flow
```
User → Search Input → GET /api/products/search?q=milk
→ Query Database → Join with Prices → Return Results
→ Display Product Cards
```

### 3. Price Comparison Flow
```
User → Select Products → POST /api/prices/compare
→ Query Prices for Products → Join with Stores
→ Calculate Distances → Sort by Price → Return Data
→ Display Comparison Table
```

### 4. Shopping List Optimization Flow
```
User → Create List → Add Items → Click Optimize
→ POST /api/lists/:id/optimize → Get All Product IDs
→ Query Prices at Nearby Stores → Calculate Coverage
→ Calculate Total Cost per Store → Rank Stores
→ Return Recommendations → Display Best Options
```

## Technology Stack Layers

```
┌──────────────────────────────────────────┐
│          Presentation Layer              │
│  - React Components                      │
│  - React Router                          │
│  - CSS (Custom)                          │
│  - Recharts (Visualization)              │
│  - React Leaflet (Maps)                  │
└──────────────────────────────────────────┘
                  ↓
┌──────────────────────────────────────────┐
│         Application Layer                │
│  - State Management (Context API)        │
│  - API Services (Axios)                  │
│  - Authentication Logic                  │
│  - Route Protection                      │
└──────────────────────────────────────────┘
                  ↓
┌──────────────────────────────────────────┐
│            API Layer                     │
│  - Express Server                        │
│  - RESTful Endpoints                     │
│  - Middleware (Auth, CORS, Helmet)       │
│  - Request Validation                    │
│  - Error Handling                        │
└──────────────────────────────────────────┘
                  ↓
┌──────────────────────────────────────────┐
│         Business Logic Layer             │
│  - Controllers                           │
│  - Models                                │
│  - Algorithms (Optimization, Distance)   │
│  - Data Processing                       │
└──────────────────────────────────────────┘
                  ↓
┌──────────────────────────────────────────┐
│           Data Layer                     │
│  - PostgreSQL Database                   │
│  - SQL Queries                           │
│  - Indexes                               │
│  - Relationships                         │
└──────────────────────────────────────────┘
```

## Key Features Implementation

### 1. Authentication
- JWT tokens stored in localStorage
- Middleware validates tokens
- Protected routes check authentication

### 2. Price Optimization
- Collects all products in shopping list
- Queries prices from nearby stores
- Calculates coverage and total cost
- Ranks stores by value

### 3. Geolocation
- Haversine formula for distance
- User location from browser API
- Store coordinates in database
- Filter by radius

### 4. Price History
- Historical prices stored daily
- Queried by date range
- Visualized with line charts
- Trend analysis

## Security Measures

```
User Input → Validation → Sanitization → Parameterized Query
                                      ↓
                              JWT Verification
                                      ↓
                              Rate Limiting
                                      ↓
                              Helmet Headers
                                      ↓
                              CORS Policy
                                      ↓
                              Database Access
```

## API Endpoints Structure

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── GET  /me (protected)
│   └── PUT  /location (protected)
├── /products
│   ├── GET  /search
│   ├── GET  /:id
│   ├── GET  /categories
│   └── GET  /brands
├── /prices
│   ├── GET  /product/:id
│   ├── GET  /history/:productId/:storeId
│   ├── POST /compare
│   └── GET  /sales
├── /stores
│   ├── GET  /
│   ├── GET  /:id
│   ├── GET  /nearby
│   ├── GET  /chain/:name
│   └── GET  /chains
├── /lists (all protected)
│   ├── POST   /
│   ├── GET    /
│   ├── GET    /:id
│   ├── PUT    /:id
│   ├── DELETE /:id
│   ├── POST   /:id/items
│   ├── PUT    /items/:itemId
│   ├── DELETE /items/:itemId
│   └── POST   /:id/optimize
└── /analytics (all protected)
    ├── GET /savings
    ├── GET /trends
    ├── GET /stats
    └── GET /popular
```

## Database Schema Relationships

```
users (1) ────── (M) shopping_lists
                        │
                        │ (1)
                        │
                        ▼ (M)
                   list_items ──── (M) products
                                         │
                                         │ (1)
                                         │
                                         ▼ (M)
                                      prices
                                         │
                                         │ (M)
                                         │
                                         ▼ (1)
                                      stores

users (1) ────── (M) price_alerts ──── (M) products
```

## Performance Optimizations

1. **Database Indexes**
   - On user email
   - On product category, brand
   - On price product_id, store_id
   - On store location coordinates

2. **Frontend**
   - Code splitting
   - Lazy loading
   - Optimistic UI updates
   - Cached API responses

3. **Backend**
   - Efficient SQL joins
   - Rate limiting
   - Connection pooling
   - Parameterized queries

---

This architecture provides a scalable, maintainable, and secure foundation for the PriceWise application.

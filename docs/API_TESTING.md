# API Testing Guide

## Test with cURL or Postman

### Health Check
```bash
curl http://localhost:5000/api/health
```

Expected: `{"success":true,"message":"PriceWise API is running",...}`

### Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

Expected: Returns user data and token

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Expected: Returns user data and JWT token
Copy the token for authenticated requests

### Search Products (Public)
```bash
curl "http://localhost:5000/api/products/search?q=milk"
```

Expected: Array of milk products

### Get Product Categories
```bash
curl http://localhost:5000/api/products/categories
```

Expected: Array of category names

### Get Sale Items
```bash
curl "http://localhost:5000/api/prices/sales?limit=10"
```

Expected: Array of products on sale

### Get Nearby Stores
```bash
curl "http://localhost:5000/api/stores/nearby?latitude=40.7128&longitude=-74.0060&radius=10"
```

Expected: Array of stores near NYC

### Compare Prices (Public)
```bash
curl -X POST http://localhost:5000/api/prices/compare \
  -H "Content-Type: application/json" \
  -d '{
    "product_ids": [1, 2, 3],
    "latitude": 40.7128,
    "longitude": -74.0060,
    "radius": 10
  }'
```

Expected: Price comparison data grouped by product

### Get User Profile (Protected)
```bash
# Replace YOUR_TOKEN with actual token from login
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: User profile data

### Create Shopping List (Protected)
```bash
curl -X POST http://localhost:5000/api/lists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test List",
    "description": "My test shopping list"
  }'
```

Expected: Created shopping list

### Get User's Shopping Lists (Protected)
```bash
curl http://localhost:5000/api/lists \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: Array of user's shopping lists

### Add Item to List (Protected)
```bash
# Replace LIST_ID with actual list ID
curl -X POST http://localhost:5000/api/lists/LIST_ID/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "product_id": 1,
    "quantity": 2,
    "notes": "On sale this week"
  }'
```

Expected: Created list item

### Optimize Shopping List (Protected)
```bash
curl -X POST http://localhost:5000/api/lists/LIST_ID/optimize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060,
    "radius": 10
  }'
```

Expected: Store recommendations with pricing

### Get Analytics - Savings (Protected)
```bash
curl "http://localhost:5000/api/analytics/savings?days=30" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: Savings data

### Get Analytics - Stats (Protected)
```bash
curl http://localhost:5000/api/analytics/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: User shopping statistics

### Get Price Trends (Protected)
```bash
curl "http://localhost:5000/api/analytics/trends?days=30" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: Price trend data

## Testing with Postman

1. Import the API endpoints
2. Create an environment variable for `token`
3. Set token after login
4. Test all endpoints

## Expected Responses

All successful responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // for list responses
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Rate Limiting

- Maximum 100 requests per 15 minutes per IP
- If exceeded, you'll get a 429 status code

## Authentication

Protected endpoints require:
```
Authorization: Bearer <your-jwt-token>
```

Token expires after 7 days by default (configurable in .env)

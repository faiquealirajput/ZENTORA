# Zentora E-Commerce Platform

## Quick Start

1. Install Node.js from https://nodejs.org
2. Install MongoDB from https://www.mongodb.com/try/download/community
3. Run these commands:

```bash
cd zentora
npm install
npm start
```

## Features

- **Customer**: Browse products, place orders, track deliveries
- **Seller**: Add products, manage inventory, view earnings
- **Admin**: Manage users, approve products, set commission rates

## Default Admin Account
- Email: admin@zentora.com
- Password: admin123
- Role: admin

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Products
- GET `/api/products` - Get all products
- POST `/api/products` - Add product (seller only)
- GET `/api/products/:id` - Get product details

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders/my-orders` - Get user orders

### Admin
- GET `/api/admin/dashboard` - Admin dashboard stats
- PUT `/api/admin/commission` - Update commission rate
- PUT `/api/admin/products/:id/approve` - Approve/reject products

## Access the App

1. Start the server: `npm start`
2. Open browser: `http://localhost:5000`
3. Register as Customer/Seller or login as Admin

## Commission System

Admin can set platform commission percentage. When orders are delivered:
- Platform earns: Order Amount × Commission %
- Seller earns: Order Amount × (100 - Commission %)

## Tech Stack

- Backend: Node.js, Express, MongoDB
- Frontend: HTML, CSS, JavaScript
- Authentication: JWT tokens
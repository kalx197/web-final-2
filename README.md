# Garage Tool Inventory & Sales Management System

A comprehensive web application for managing garage tool inventory, tracking stock levels, and processing sales transactions. Built with Node.js, Express.js, and vanilla JavaScript.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access (Admin/Staff)
  - Secure password hashing with bcrypt

- **Inventory Management**
  - CRUD operations for products
  - Real-time stock tracking
  - Low stock alerts
  - Product categorization and search

- **Sales Management**
  - Process sales with multiple items
  - Automatic stock deduction
  - Sales history and statistics
  - Revenue tracking

- **Security Features**
  - JWT token-based authentication
  - Password hashing
  - Rate limiting (100 requests per 15 minutes)
  - Helmet.js security headers
  - CORS configuration
  - Input validation and sanitization

- **Logging**
  - Winston logger for application logs
  - Morgan for HTTP request logging
  - Error logging and tracking

## Technology Stack

### Backend
- Node.js
- Express.js
- MySQL
- JWT (jsonwebtoken)
- bcryptjs
- Passport.js
- Winston (logging)
- Helmet.js
- CORS

### Frontend
- Vanilla JavaScript
- HTML5
- CSS3
- Fetch API

### Development Tools
- Nodemon
- ESLint (recommended)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/garage-tool-shop.git
cd garage-tool-shop

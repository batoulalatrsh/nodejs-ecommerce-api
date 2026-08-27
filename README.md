# 🛒 Node.js E-Commerce API

A full-featured RESTful API for an e-commerce platform, built with **Node.js**, **Express**, and **MongoDB (Mongoose)**. It follows a clean MVC architecture and provides everything needed to power an online store — product catalog, cart, orders, payments, authentication, and more.

## 🚀 Live Demo

```
https://nodejs-ecommerce-api-production.up.railway.app
```

## ✨ Features

- **Authentication & Authorization** — JWT-based auth with role-based access control (user/admin/manager)
- **Product Management** — CRUD for products, categories, and subcategories with image upload
- **Shopping Cart** — Add, update, remove items with automatic price/discount calculation
- **Orders & Checkout** — Order creation with Stripe payment integration
- **Reviews & Ratings** — Users can review and rate products
- **Wishlist** — Save favorite products for later
- **Coupons & Discounts** — Apply discount codes at checkout
- **Image Processing** — Automatic image resizing/optimization with Sharp
- **Email Notifications** — Password reset and order confirmation emails via Nodemailer
- **Security** — Password hashing (bcrypt), input validation, CORS, and compression
- **Logging** — Request logging with Morgan (development mode)

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| Payments | Stripe |
| File Uploads | Multer, Sharp |
| Validation | express-validator |
| Email | Nodemailer |
| Deployment | Railway |

## 📁 Project Structure

The project follows an **MVC architecture** with clear separation of concerns:

```
├── config/          # Environment & app configuration
├── middlewares/      # Custom middleware (auth, error handling, validation)
├── models/           # Mongoose schemas (Product, Cart, Order, User, etc.)
├── routes/           # API route definitions
├── services/          # Business logic layer
├── utils/            # Helper functions & validators
├── uploads/           # Uploaded product/user images
├── server.js          # Application entry point
└── package.json
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB database (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/batoulalatrsh/nodejs-ecommerce-api.git
cd nodejs-ecommerce-api

# Install dependencies
npm install

# Create a .env / config.env file with the required variables (see below)

# Run in development mode
npm run start:dev

# Run in production mode
npm run start:prod
```

## 📡 API Endpoints

Base URL: `/api/v1`

| Resource | Description |
|---|---|
| `/auth` | Register, login, password reset |
| `/users` | User profile management |
| `/categories` | Category CRUD |
| `/subcategories` | Subcategory CRUD |
| `/products` | Product CRUD |
| `/cart` | Shopping cart operations |
| `/orders` | Order creation & management |
| `/reviews` | Product reviews |
| `/wishlist` | Wishlist management |
| `/coupons` | Discount coupons |

> Full endpoint documentation coming soon.

## 🧑‍💻 Author

**Batoul Alatrsh**

## 📄 License

This project is licensed under the ISC License.

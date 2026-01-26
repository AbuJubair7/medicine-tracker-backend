# 🏥 Medicine Tracker Backend

A robust RESTful API built with **Express.js**, **TypeScript**, and **PostgreSQL**. This system manages users, medicine inventories (stocks), and tracking schedules, featuring secure authentication and a modular architecture.

## 🚀 Features

- **Authentication**: Secure Signup/Login with **JWT** strategies and **Google OAuth**.
- **User Management**: Profile management and secure password handling (`bcryptjs`).
- **Inventory System**: Users can create multiple "Stocks" (e.g., "Home Kit", "Travel Bag").
- **Medicine Tracking**: Add medicines to stocks with detailed attributes (dose, quantity, schedule).
- **Relational Data**: Structured using **TypeORM** entities (User ↔ Stocks ↔ Medicines).
- **Validation**: Strict request validation using `class-validator` and DTOs.
- **Production Ready**: Configured for **Vercel** (Serverless) and **Supabase** (Postgres).

## 📂 Project Structure

```text
backend/
├── src/
│   ├── database/
│   │   ├── archived_migrations/      # Legacy migration backups
│   │   ├── migrations/               # Active TypeORM migrations
│   │   └── data-source.ts            # Database connection config
│   ├── middleware/
│   │   ├── authMiddleware.ts         # JWT Verification middleware
│   │   └── validateDTO.ts            # Request Body Validation
│   ├── modules/
│   │   ├── user/
│   │   │   ├── dto/                  # User DTOs (Create, Login)
│   │   │   ├── entities/             # User Entity
│   │   │   ├── userController.ts     # User Route Handlers
│   │   │   └── userServices.ts       # Business Logic
│   │   └── stock/
│   │       ├── dto/                  # Stock & Medicine DTOs
│   │       ├── entities/             # Stock & Medicine Entities
│   │       ├── stockController.ts    # Stock Route Handlers
│   │       └── stockServices.ts      # Stock Services
│   ├── public/                       # Static Assets
│   ├── appController.ts              # Root Controller
│   ├── appServices.ts                # Root Services
│   ├── index.ts                      # Vercel Serverless Entry Point
│   └── main.ts                       # Express App Configuration
├── .env                              # Environment Variables
├── package.json                      # Scripts & Dependencies
├── tsconfig.json                     # TypeScript Config
├── vercel.json                       # Deployment Config
└── README.md                         # Project Documentation
```

## 🛠 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JSON Web Tokens (JWT), Google Auth Library
- **Deployment**: Vercel (Serverless), Supabase (Managed Postgres)

## ⚡ Getting Started

### 1. Installation

```bash
git clone <repository_url>
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# ☁️ CLOUD DATABASE (Supabase)
# Use the "Subject/Transaction Pooler" string (IPv4 compatible)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres

# 🏠 LOCAL DATABASE (Fallback)
# Used only if DATABASE_URL is not set
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_local_password
DB_NAME=medicine-tracker

# 🔑 APP CONFIG
PORT=3000
NODE_ENV=development
JWT_SECRET=super_secret_key_change_me
JWT_EXPIRES_IN=1d
GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Database Migration

Run this command to create the tables in your database:

```bash
npm run migration:run
```

### 4. Running the Server

**Development (Hot Reload):**

```bash
npm run start
```

_Server will run on `http://localhost:3000`_

## � API Endpoints

All protected routes require the `Authorization: Bearer <token>` header.

### 👤 User Module (`/user`)

| Method | Endpoint        | Description               | Auth |
| :----- | :-------------- | :------------------------ | :--- |
| `GET`  | `/`             | Service health check      | ❌   |
| `POST` | `/signup`       | Register a new account    | ❌   |
| `POST` | `/login`        | Login with email/password | ❌   |
| `POST` | `/google-login` | Login with Google Token   | ❌   |
| `GET`  | `/all`          | Retrieve all users        | ✅   |
| `GET`  | `/:id`          | Get user details by ID    | ✅   |

### 📦 Stock & Medicine Module (`/stock`)

| Method   | Endpoint                | Description                        | Auth |
| :------- | :---------------------- | :--------------------------------- | :--- |
| `GET`    | `/`                     | Service health check               | ❌   |
| `POST`   | `/create`               | Create a new Stock                 | ✅   |
| `GET`    | `/getAll`               | Get all stocks for logged-in user  | ✅   |
| `GET`    | `/get/:id`              | Get specific stock details         | ✅   |
| `PATCH`  | `/:id`                  | Update stock name                  | ✅   |
| `DELETE` | `/:id`                  | Delete a stock (and its medicines) | ✅   |
| `POST`   | `/insertMedicine/:id`   | Add a Medicine to a Stock          | ✅   |
| `PATCH`  | `/medicine/:medicineId` | Update Medicine details            | ✅   |
| `DELETE` | `/medicine/:medicineId` | Remove a Medicine                  | ✅   |

## 📜 Scripts

| Command                      | Description                              |
| :--------------------------- | :--------------------------------------- |
| `npm run start`              | Starts dev server using `nodemon`        |
| `npm run build`              | Compiles TypeScript to `dist/`           |
| `npm run migration:run`      | Applies pending migrations to DB         |
| `npm run migration:generate` | Generates new migration based on changes |
| `npm run migration:revert`   | Reverts the last migration               |

## ☁️ Deployment Guide

### Deploying to Vercel

1.  **Push to GitHub**: Ensure your latest code is on GitHub.
2.  **Import Project**: In Vercel, import your repository.
3.  **Environment Variables**: Add your `DATABASE_URL`, `JWT_SECRET`, and `GOOGLE_CLIENT_ID`.
4.  **Deploy**: Vercel handles the build automatically using `vercel.json`.

---

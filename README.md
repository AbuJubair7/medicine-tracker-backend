# Medicine Tracker Backend

This is the backend service for the **Dosely** application, built with **Node.js, Express, TypeScript, and TypeORM**.

## 🏗 System Architecture

The project follows a **Domain-Driven Modular Architecture**. This design ensures segregation of duties, where each feature (User, Stock) is encapsulated in its own module.

### Core Components
1.  **Modules**: Self-contained directories (`src/modules/*`) that bundle:
    -   **Entities**: Database schema definitions.
    -   **DTOs**: Validation schemas for incoming data.
    -   **Services**: Pure business logic and database interactions.
    -   **Controllers**: HTTP request handling and response formatting.
2.  **Shared Helpers**: Reusable logic like `deductionHelper` (for medicine calculations) and `DateUtil` (for timezone consistency).
3.  **Middleware**: Global interceptors for Authentication (`authMiddleware`) and Data Validation (`validateDTO`).

### Directory Tree
```
backend/
├── src/
│   ├── database/             # Database configuration
│   │   ├── migrations/       # SQL Migration files
│   │   └── data-source.ts    # TypeORM DataSource
│   │
│   ├── helpers/              # Business Logic Helpers
│   │   └── deductionHelper.ts # Auto-deduction logic
│   │
│   ├── middleware/           # Express Middleware
│   │   ├── authMiddleware.ts
│   │   └── validateDTO.ts
│   │
│   ├── modules/              # Domain Modules
│   │   ├── user/
│   │   │   ├── dto/          # Input Validation (CreateUser, Login)
│   │   │   ├── entities/     # User Entity
│   │   │   ├── userController.ts
│   │   │   └── userServices.ts
│   │   └── stock/
│   │       ├── dto/          # Input Validation (Stock, Medicine)
│   │       ├── entities/     # Stock & Medicine Entities
│   │       ├── stockController.ts
│   │       └── stockServices.ts
│   │
│   ├── utils/                # Shared Utilities
│   │   └── DateUtil.ts       # Timezone handling (Asia/Dhaka)
│   │
│   ├── appController.ts      # Root Controller
│   ├── appServices.ts        # Root Service
│   ├── index.ts              # Entry Point
│   └── main.ts               # App Initialization
│
├── .env                      # Environment Variables
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript Config
```

## 🔌 API Endpoints

### 👤 User Module (`/user`)

| Method | Endpoint | Description | Auth Required | Body Params |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/user/signup` | Create a new user account | ❌ No | `name`, `email`, `password` |
| `POST` | `/user/login` | Log in existing user | ❌ No | `email`, `password` |
| `POST` | `/user/google-login` | Authenticate via Google OAuth | ❌ No | `token` (Google ID Token) |
| `GET` | `/user/all` | Fetch all registered users | ✅ Yes | - |
| `GET` | `/user/:id` | Fetch specific user details | ✅ Yes | - |

### 📦 Stock Module (`/stock`)

| Method | Endpoint | Description | Auth Required | Body/Query Params |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/stock/getAll` | List all stocks for current user | ✅ Yes | Query: `page`, `limit` |
| `POST` | `/stock/create` | Create a new stock container | ✅ Yes | Body: `name` |
| `GET` | `/stock/:id` | Get stock details + medicines | ✅ Yes | - |
| `PATCH` | `/stock/:id` | Rename a stock | ✅ Yes | Body: `name` |
| `DELETE` | `/stock/:id` | Delete a stock and its medicines | ✅ Yes | - |
| `POST` | `/stock/insertMedicine/:id` | Add medicine to stock | ✅ Yes | Body: `name`, `dose`, `quantity`, `take*` |
| `PATCH` | `/stock/medicine/:id` | Update medicine details | ✅ Yes | Body: Partial Medicine fields |
| `DELETE` | `/stock/medicine/:id` | Delete a medicine | ✅ Yes | - |

## 🚀 Key Features Implementation

### 1. 🕒 Timezone Awareness
The system strictly enforces **Bangladesh Standard Time (UTC+6)** for all `createdAt` and logic timestamps using `src/utils/DateUtil.ts`. This ensures that a user in Singapore still sees operations happen in "Dhaka Time".

### 2. 💊 Auto-Deduction Logic
Stored in `src/helpers/deductionHelper.ts`. When a user fetches a stock (`GET /stock/:id`), the system:
1.  Calculates the time elapsed since `lastDeductedAt`.
2.  Checks specifically against Morning (9 AM), Noon (2 PM), and Evening (9 PM) boundaries in **BD Time**.
3.  Deducts minimal quantities required and updates the database.

### 3. ⚡️ Performance
-   **Optimized Dashboard**: `GET /stock/getAll` uses `loadRelationCountAndMap` to return `medicineCount` efficiently without loading thousands of medicine rows.
-   **Optimized Insertion**: `POST /stock/insertMedicine` returns *only* the newly created medicine object, allowing the frontend to update state in O(1) time.

## 📦 Setup & Run

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables (`.env`)**
    Create a `.env` file in the root `backend/` directory.

    ### Sample `.env` Architecture
    ```env
    # --- Server Configuration ---
    PORT=3000

    # --- Database Connection (PostgreSQL) ---
    # Connection String (Preferred)
    DATABASE_URL=postgres://user:password@localhost:5432/medicine_tracker
    
    # OR Individual Params (If supported by data-source.ts)
    # DB_HOST=localhost
    # DB_PORT=5432
    # DB_USERNAME=postgres
    # DB_PASSWORD=secret
    # DB_NAME=medicine_tracker

    # --- Security (JWT) ---
    # Secret key for signing encryption tokens. 
    # TIP: Generate a strong random string (e.g., `openssl rand -base64 32`)
    JWT_SECRET=super_secure_random_string_here_12345
    
    # Token Expiration (e.g., 1h, 7d)
    JWT_EXPIRES_IN=7d

    # --- External Services ---
    # Google OAuth Client ID (Get this from Google Cloud Console)
    GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
    ```

3.  **Start Server**
    ```bash
    npm start
    ```

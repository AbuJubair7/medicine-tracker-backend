# Medicine Tracker Backend

A backend RESTful API for managing users, stocks, and medicines, built with Express.js, TypeScript, and PostgreSQL using TypeORM. This project demonstrates modular architecture, authentication, validation, and relational data management for a medicine tracking system.

## Features

- User authentication and management
- Stock management (each user can have multiple stocks)
- Medicine management (each stock can have multiple medicines)
- Secure JWT-based authentication
- DTO validation with class-validator
- Modular, scalable codebase

## File Structure

```
backend/
├── src/
│   ├── appController.ts
│   ├── appServices.ts
│   ├── index.ts
│   ├── main.ts
│   ├── database/
│   │   ├── data-source.ts
│   │   └── migrations/
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   └── validateDTO.ts
│   ├── modules/
│   │   ├── stock/
│   │   │   ├── stockController.ts
│   │   │   ├── stockServices.ts
│   │   │   ├── dto/
│   │   │   │   ├── stock.dto.ts
│   │   │   │   └── medicine.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── stockEntity.ts
│   │   │   │   └── medicineEntity.ts
│   │   └── user/
│   │       ├── userController.ts
│   │       ├── userServices.ts
│   │       ├── dto/
│   │       │   ├── createUser.dto.ts
│   │       │   └── loginUser.dto.ts
│   │       └── entities/
│   │           └── userEntity.ts
│   └── public/
├── package.json
├── tsconfig.json
├── README.md
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the .env file

Create a `.env` file in the root directory with the following content:

```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_db_password
DB_NAME=medicine-tracker

PORT=3000
NODE_ENV=development

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
```

### 4. Database Setup

Make sure PostgreSQL is running and a database named `medicine-tracker` exists. You can create it using:

```bash
createdb medicine-tracker
```

### 5. Run Migrations (optional, if using migrations)

```bash
npm run migration:run
```

### 6. Build and Start the Server

For development (auto-reload):

```bash
npm run start
```

For production (compiled):

```bash
npm run start:compiled
```

## Available Scripts

| Command                                           | Description                              |
| ------------------------------------------------- | ---------------------------------------- |
| `npm run build`                                   | Compile TypeScript to JavaScript         |
| `npm run start`                                   | Start development server with hot reload |
| `npm run start:compiled`                          | Build and run the compiled application   |
| `npm run migration:create --name=MigrationName`   | Create a new migration                   |
| `npm run migration:generate --name=MigrationName` | Generate migration from changes          |
| `npm run migration:run`                           | Run migrations                           |
| `npm run migration:revert`                        | Revert last migration                    |

## API Overview

### User Endpoints

- `POST /user/signup` — Register a new user
- `POST /user/login` — Login and receive JWT
- `GET /user/all` — Get all users (auth required)

### Stock Endpoints

- `POST /stock/create` — Create a new stock (auth required)
- `GET /stock/getAll` — Get all stocks for logged-in user
- `GET /stock/get/:id` — Get stock by ID

### Medicine Endpoints

- `POST /stock/:id/medicine` — Add medicine to a stock
- `PATCH /stock/medicine/:id` — Update medicine
- `DELETE /stock/medicine/:id` — Delete medicine

## API Endpoints

### User Endpoints (`/user`)

- `POST /signup` — Register a new user
- `POST /login` — Login and receive JWT
- `GET /all` — Get all users (auth required)
- `GET /:id` — Get user by ID (auth required)

### Stock Endpoints (`/stock`)

- `GET /` — Greeting (test endpoint)
- `POST /create` — Create a new stock (auth required)
- `GET /getAll` — Get all stocks for logged-in user (auth required)
- `GET /get/:id` — Get stock by ID (auth required)
- `PATCH /:id` — Update stock by ID (auth required)
- `DELETE /:id` — Delete stock by ID (auth required)

### Medicine Endpoints (under `/stock`)

- `POST /insertMedicine/:id` — Add medicine to a stock (auth required, :id = stockId)
- `PATCH /medicine/:medicineId` — Update medicine by medicineId (auth required)
- `DELETE /medicine/:medicineId` — Delete medicine by medicineId (auth required)

## Technologies Used

- Express.js
- TypeScript
- TypeORM
- PostgreSQL
- class-validator
- class-transformer
- JWT (jsonwebtoken)

## Notes

- Ensure your .env file is correctly set up before starting the server.
- For development, the database schema will auto-sync if NODE_ENV=development.
- Use migrations for production schema changes.

## License

MIT

## Prerequisites

- Node.js ≥ 18
- npm or yarn
- PostgreSQL database

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure the database connection in `src/database/data-source.ts`:

```typescript
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "your-password",
  database: "your-database",
  synchronize: true,
  entities: [User],
  subscribers: [],
  migrations: ["dist/database/migrations/*.js"],
});
```

## Scripts

| Command                  | Description                              |
| ------------------------ | ---------------------------------------- |
| `npm run build`          | Compile TypeScript to JavaScript         |
| `npm run start`          | Start development server with hot reload |
| `npm run start:compiled` | Build and run the compiled application   |

## API Endpoints

### User Routes

| Method | Endpoint    | Description       |
| ------ | ----------- | ----------------- |
| GET    | `/user`     | Greeting message  |
| POST   | `/user`     | Create a new user |
| GET    | `/user/all` | Get all users     |
| GET    | `/user/:id` | Get user by ID    |

### Product Routes

| Method | Endpoint   | Description    |
| ------ | ---------- | -------------- |
| GET    | `/product` | Product routes |

## Usage Example

**Create a new user:**

```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "secret123"}'
```

**Get all users:**

```bash
curl http://localhost:3000/user/all
```

## Technologies

- [Express.js](https://expressjs.com/) - Web framework
- [TypeORM](https://typeorm.io/) - ORM for TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Database
- [class-validator](https://github.com/typestack/class-validator) - Validation decorators
- [class-transformer](https://github.com/typestack/class-transformer) - Object transformation

## License

MIT## Development

```bash
npm run dev
```

## Testing

```bash
npm test
```

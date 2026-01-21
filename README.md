# Backend API

A modern, scalable RESTful API built with Express.js and TypeScript. This project provides a robust foundation for building backend services with features like database integration using TypeORM, request validation with class-validator, and a modular architecture for easy maintenance and scalability.

## Features

- **TypeScript** - Type-safe development with full IntelliSense support
- **Express.js 5** - Fast, unopinionated web framework
- **TypeORM** - Elegant ORM for PostgreSQL database operations
- **class-validator** - Decorator-based request validation
- **class-transformer** - Transform plain objects to class instances
- **Modular Architecture** - Organized by feature modules (User, Product, etc.)

## Project Structure

```
backend/
├── src/
│   ├── database/
│   │   └── data-source.ts      # TypeORM database configuration
│   ├── middleware/
│   │   └── validateDTO.ts      # Request validation middleware
│   ├── module/
│   │   ├── product/
│   │   │   ├── productController.ts
│   │   │   ├── productDTO.ts
│   │   │   └── productServices.ts
│   │   └── user/
│   │       ├── userController.ts
│   │       ├── userDTO.ts
│   │       ├── userEntity.ts   # TypeORM entity
│   │       └── userServices.ts
│   ├── public/
│   ├── appController.ts
│   ├── appServices.ts
│   ├── index.ts                # Application entry point
│   └── main.ts                 # Server configuration
├── dist/                       # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

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

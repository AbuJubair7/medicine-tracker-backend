import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../modules/user/entities/userEntity";
import * as dotenv from "dotenv";
import { Stock } from "../modules/stock/entities/stockEntity";
import { Medicine } from "../modules/stock/entities/medicineEntity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url:
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_URL
      : undefined,
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password:
    process.env.NODE_ENV === "production"
      ? process.env.DB_PASSWORD_PROD
      : process.env.DB_PASSWORD_DEV,
  database: process.env.DB_NAME || "test-db",
  synchronize: process.env.NODE_ENV !== "production", // Auto-create tables (disable in production)
  logging: process.env.NODE_ENV !== "production", // Enable logging in development
  entities: [User, Stock, Medicine], // declare entities here
  subscribers: [],
  migrations: ["dist/database/migrations/*.js"],
  ssl:
    process.env.NODE_ENV !== "production"
      ? false
      : { rejectUnauthorized: false },
});

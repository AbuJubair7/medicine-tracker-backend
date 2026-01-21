import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../module/user/userEntity";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE as "postgres") || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test-db",
  synchronize: process.env.NODE_ENV === "development", // Auto-create tables (disable in production)
  logging: false,
  entities: [User], // declare entities here
  subscribers: [],
  migrations: [],
});

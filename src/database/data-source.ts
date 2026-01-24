import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../modules/user/entities/userEntity";
import * as dotenv from "dotenv";
import { Stock } from "../modules/stock/entities/stockEntity";
import { Medicine } from "../modules/stock/entities/medicineEntity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE as "postgres") || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test-db",
  synchronize: false, // Auto-create tables (disable in production)
  logging: false,
  entities: [User, Stock, Medicine], // declare entities here
  subscribers: [],
  migrations: ["dist/database/migrations/*.js"],
});

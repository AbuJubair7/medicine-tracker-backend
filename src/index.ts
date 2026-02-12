process.env.TZ = 'Asia/Dhaka'; // for vercel deployment
import "reflect-metadata";
import { server, routes, controllers } from "./main";
import express from "express";
import { AppDataSource } from "./database/data-source";
import * as dotenv from "dotenv";
import cors from "cors";
import { Request, Response } from "express-serve-static-core";
dotenv.config();

let dataSourceInitialized = false;
async function initializeApp() {
  if (!dataSourceInitialized) {
    try {
      // Initialize database connection
      await AppDataSource.initialize();
      dataSourceInitialized = true;
      console.log("Database connected successfully!");
      // Middleware setup
      server.use(cors());
      server.use(express.json());
      server.use(express.urlencoded({ extended: true }));
      // Use routes
      Object.entries(routes).forEach(([path, route]) => {
        server.use(path, route);
      });
      // Activate routes in controllers
      Object.values(controllers).forEach((controller) =>
        controller.activateRoutes(),
      );
    } catch (error) {
      console.error("Error connecting to database:", error);
      process.exit(1);
    }
  }
}
// Vercel serverless handler
export default async function handler(req: Request, res: Response) {
  await initializeApp();
  server(req, res);
}

// For local development: start server if run directly
if (require.main === module) {
  initializeApp().then(() => {
    server.listen(process.env.PORT || 3000, () => {
      if (process.env.NODE_ENV === "development") {
        console.log("Running in development mode with hot reload");
      }
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  });
}

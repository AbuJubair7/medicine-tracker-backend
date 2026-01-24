import "reflect-metadata";
import { server, routes, services, controllers } from "./main";
import express from "express";
import { AppDataSource } from "./database/data-source";
import * as dotenv from "dotenv";

dotenv.config();

const app = {
  server,
  routes,
  services,
  controllers,
  init: async (): Promise<void> => {
    // Initialize database connection
    try {
      await AppDataSource.initialize();
      console.log("Database connected successfully!");
    } catch (error) {
      console.error("Error connecting to database:", error);
      process.exit(1);
    }

    app.server.use(express.json());
    app.server.use(express.urlencoded({ extended: true }));
    // use routes
    Object.entries(app.routes).forEach(([path, route]) => {
      console.log(`[DEBUG] Registering route: ${path}`);
      app.server.use(path, route);
    });
    // activate routes in controllers
    Object.values(app.controllers).forEach((controller) =>
      controller.activateRoutes(),
    );
    // start server
    app.server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  },
};

app.init();

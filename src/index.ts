import { CONFIG, server, routes, services, controllers } from "./main";
import express from "express";

const app = {
  server,
  routes,
  services,
  controllers,
  init: (): void => {
    app.server.use(express.json());
    app.server.use(express.urlencoded({ extended: true }));
    // use routes
    Object.entries(app.routes).forEach(([path, route]) =>
      app.server.use(path, route),
    );
    // activate routes
    Object.values(app.controllers).forEach((controller) =>
      controller.activateRoutes(),
    );
    // start server
    app.server.listen(CONFIG.PORT, () => {
      console.log(`Server is running on port ${CONFIG.PORT}`);
    });
  },
};

app.init();

import express from "express";
import AppController from "./appController";
import AppServices from "./appServices";
import UserController from "./modules/user/userController";
import UserServices from "./modules/user/userServices";
import { StockServices } from "./modules/stock/stockServices";
import { StockController } from "./modules/stock/stockController";

export const server = express();

// decalre routes here
export const routes = {
  "/user": express.Router(),
  "/stock": express.Router(),
};
// declare services here
export const services = {
  appServices: new AppServices(),
  userServices: new UserServices(),
  stockServices: new StockServices(),
};
// declare controllers here
export const controllers = {
  appController: new AppController(services.appServices, server),
  userController: new UserController(services.userServices, routes["/user"]),
  stockController: new StockController(
    services.stockServices,
    routes["/stock"],
  ),
};

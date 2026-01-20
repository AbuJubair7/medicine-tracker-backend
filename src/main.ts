import express from "express";
import AppController from "./appController";
import AppServices from "./appServices";
import UserController from "./module/user/userController";
import UserServices from "./module/user/userServices";
import ProductServices from "./module/product/productServices";
import ProductController from "./module/product/productController";

export const CONFIG = {
  PORT: 3000,
};

export const server = express();

// decalre routes here
export const routes = {
  "/user": express.Router(),
  "/product": express.Router(),
};
// declare services here
export const services = {
  appServices: new AppServices(),
  userServices: new UserServices(),
  productServices: new ProductServices(),
};
// declare controllers here
export const controllers = {
  appController: new AppController(services.appServices, server),
  userController: new UserController(services.userServices, routes["/user"]),
  productController: new ProductController(services.productServices, routes["/product"]),
};

import { Request, Response, Router } from "express";
import ProductServices from "./productServices";

export default class ProductController {
  constructor(
    private readonly services: ProductServices,
    private readonly app: Router,
  ) {}
  activateRoutes = (): void => {
    this.app.get("/", (req: Request, res: Response) => {
      res.send(this.services.productGreet());
    });
  };
}

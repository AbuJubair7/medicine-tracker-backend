import AppServices from "./appServices";
import { Express, Request, Response } from "express";

export default class AppController {
  constructor(
    private readonly services: AppServices,
    private readonly app: Express,
  ) {}
  activateRoutes = (): void => {
    this.app.get("/", (req: Request, res: Response) => {
      res.send(this.services.greeting());
    });
  };
}

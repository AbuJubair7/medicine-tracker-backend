import { Request, Response, Router } from "express";
import UserServices from "./userServices";

export default class UserController {
  constructor(
    private readonly services: UserServices,
    private readonly app: Router,
  ) {}
  activateRoutes = (): void => {
    this.app.get("/", (req: Request, res: Response) => {
      res.send(this.services.userGreet());
    });
  };
}

import { Request, Response, Router } from "express";
import UserServices from "./userServices";
import { validateDTO } from "../../middleware/validateDTO";
import { UserDTO } from "./user.dto";

export default class UserController {
  constructor(
    private readonly services: UserServices,
    private readonly app: Router,
  ) {}
  activateRoutes = (): void => {
    this.app.get("/", (req: Request, res: Response) => {
      res.send(this.services.userGreet());
    });

    // Create a new user (with validation middleware)
    this.app.post(
      "/",
      validateDTO(UserDTO),
      async (req: Request, res: Response) => {
        try {
          const { name, email, password } = req.body;
          const user = await this.services.createUser({
            name,
            email,
            password,
          });
          res.status(201).json(user);
        } catch (error) {
          res.status(500).json({ error: "Failed to create user" });
        }
      },
    );

    // Get all users
    this.app.get("/all", async (req: Request, res: Response) => {
      try {
        const users = await this.services.getAllUsers();
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
      }
    });

    // Get user by ID
    this.app.get("/:id", async (req: Request, res: Response) => {
      try {
        const user = await this.services.getUserById(Number(req.params.id));
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ error: "User not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
      }
    });
  };
}

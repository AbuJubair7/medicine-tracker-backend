import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import UserController from "../../modules/user/userController";
import UserServices from "../../modules/user/userServices";

class FakeUserServices {
  userGreet = jest.fn(() => "User page");
  createUser = jest.fn(async () => "test-token");
  loginUser = jest.fn(async () => "test-token");
  googleLogin = jest.fn(async () => "test-token");
  getAllUsers = jest.fn(async () => []);
  getUserById = jest.fn(async (id: number) => ({ id }));
}

const buildApp = () => {
  const app = express();
  app.use(express.json());

  const router = express.Router();
  const services = new FakeUserServices();
  const controller = new UserController(
    services as unknown as UserServices,
    router,
  );
  controller.activateRoutes();
  app.use("/user", router);

  return { app, services };
};

describe("User routes", () => {
  it("GET /user returns greeting", async () => {
    const { app } = buildApp();
    const response = await request(app).get("/user");
    expect(response.status).toBe(200);
    expect(response.text).toBe("User page");
  });

  it("POST /user/signup returns 400 for invalid payload", async () => {
    const { app, services } = buildApp();
    const response = await request(app)
      .post("/user/signup")
      .send({ name: "A", email: "not-an-email" });

    expect(response.status).toBe(400);
    expect(services.createUser).not.toHaveBeenCalled();
  });

  it("POST /user/signup creates user when payload is valid", async () => {
    const { app, services } = buildApp();
    const response = await request(app)
      .post("/user/signup")
      .send({ name: "A", email: "a@example.com", password: "secret1" });

    expect(response.status).toBe(201);
    expect(response.body.token).toBe("test-token");
    expect(services.createUser).toHaveBeenCalledWith({
      name: "A",
      email: "a@example.com",
      password: "secret1",
    });
  });

  it("GET /user/all returns 401 without a token", async () => {
    const { app } = buildApp();
    const response = await request(app).get("/user/all");
    expect(response.status).toBe(401);
  });

  it("GET /user/all returns data with a valid token", async () => {
    const { app, services } = buildApp();
    const token = jwt.sign(
      { id: 1, email: "a@example.com" },
      process.env.JWT_SECRET || "test-secret",
    );

    const response = await request(app)
      .get("/user/all")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(services.getAllUsers).toHaveBeenCalled();
  });
});

import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { StockController } from "../../modules/stock/stockController";
import { StockServices } from "../../modules/stock/stockServices";

class FakeStockServices {
  stockGreet = jest.fn(() => "Stock page.... Welcome!");
  createStock = jest.fn(async (_userId: number, data: { name: string }) => ({
    id: 1,
    ...data,
  }));
  getStocksByUserId = jest.fn(async () => ({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
  }));
  getStockById = jest.fn(async (id: number) => ({ id }));
  insertMedicineToStock = jest.fn(async () => ({ id: 1 }));
  updateStockById = jest.fn(async () => ({ id: 1 }));
  deleteStockById = jest.fn(async () => ({ message: "ok" }));
  updateMedicineInStock = jest.fn(async () => ({ id: 1 }));
  deleteMedicineFromStock = jest.fn(async () => ({ message: "ok" }));
}

const buildApp = () => {
  const app = express();
  app.use(express.json());

  const router = express.Router();
  const services = new FakeStockServices();
  const controller = new StockController(
    services as unknown as StockServices,
    router,
  );
  controller.activateRoutes();
  app.use("/stock", router);

  return { app, services };
};

describe("Stock routes", () => {
  it("GET /stock returns greeting", async () => {
    const { app } = buildApp();
    const response = await request(app).get("/stock");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Stock page.... Welcome!");
  });

  it("POST /stock/create returns 401 without token", async () => {
    const { app } = buildApp();
    const response = await request(app)
      .post("/stock/create")
      .send({ name: "Main" });

    expect(response.status).toBe(401);
  });

  it("POST /stock/create returns 400 for invalid payload", async () => {
    const { app } = buildApp();
    const token = jwt.sign(
      { id: 1, email: "a@example.com" },
      process.env.JWT_SECRET || "test-secret",
    );

    const response = await request(app)
      .post("/stock/create")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("POST /stock/create creates a stock with valid payload", async () => {
    const { app, services } = buildApp();
    const token = jwt.sign(
      { id: 7, email: "a@example.com" },
      process.env.JWT_SECRET || "test-secret",
    );

    const response = await request(app)
      .post("/stock/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Main" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 1, name: "Main" });
    expect(services.createStock).toHaveBeenCalledWith(7, { name: "Main" });
  });
});

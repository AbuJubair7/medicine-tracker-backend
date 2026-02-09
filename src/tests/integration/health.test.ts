import express from "express";
import request from "supertest";
import AppController from "../../appController";
import AppServices from "../../appServices";

describe("Health Check / Integration Test", () => {
  it("should respond to GET / with the greeting", async () => {
    const app = express();
    const controller = new AppController(new AppServices(), app);
    controller.activateRoutes();

    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello from App");
  });
});

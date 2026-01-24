import { Router, Request, Response } from "express";
import { StockServices } from "./stockServices";
import { verifyToken } from "../../middleware/authMiddleware";
import { validateDTO } from "../../middleware/validateDTO";
import { StockDTO } from "./dto/stock.dto";

export class StockController {
  constructor(
    private readonly stockServices: StockServices,
    private readonly app: Router,
  ) {}

  activateRoutes = (): void => {
    this.app.get("/", (req: Request, res: Response) => {
      res.send(this.stockServices.stockGreet());
    });

    this.app.post(
      "/create",
      verifyToken,
      validateDTO(StockDTO),
      async (req: Request, res: Response) => {
        try {
          const stockData = req.body;
          const result = await this.stockServices.createStock(stockData);
          res.status(201).json(result);
        } catch (error: any) {
          res.status(500).json({ error: error.message });
        }
      },
    );

    this.app.get(
      "/getAll/:userId",
      verifyToken,
      async (req: Request, res: Response) => {
        const userId = Number(req.params.userId);
        try {
          const stocks = await this.stockServices.getStocksByUserId(userId);
          res.json(stocks);
        } catch (error: any) {
          res.status(500).json({ error: error.message });
        }
      },
    );

    this.app.get(
      "/get/:id",
      verifyToken,
      async (req: Request, res: Response) => {
        const stockId = Number(req.params.id);
        try {
          const stock = await this.stockServices.getStockById(stockId);
          if (!stock) {
            return res.status(404).json({ error: "Stock not found" });
          }
          res.json(stock);
        } catch (error: any) {
          res.status(500).json({ error: error.message });
        }
      },
    );
  };
}

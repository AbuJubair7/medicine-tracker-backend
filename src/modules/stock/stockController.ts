import { Router, Request, Response } from "express";
import { StockServices } from "./stockServices";
import { verifyToken } from "../../middleware/authMiddleware";
import { validateDTO } from "../../middleware/validateDTO";
import { StockDTO } from "./dto/stock.dto";
import { MedicineDTO } from "./dto/medicine.dto";

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
          const userId = res.locals.user.id;
          const stockData = req.body;
          const result = await this.stockServices.createStock(
            userId,
            stockData,
          );
          res.status(201).json(result);
        } catch (error: any) {
          res.status(500).json({ error: error.message });
        }
      },
    );

    this.app.get(
      "/getAll",
      verifyToken,
      async (req: Request, res: Response) => {
        try {
          const userId = res.locals.user.id;
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

    //insert medicine to stock
    this.app.post(
      "/insertMedicine/:id",
      verifyToken,
      validateDTO(MedicineDTO),
      async (req: Request, res: Response) => {
        const stockId = Number(req.params.id);
        const medicineData = req.body;
        try {
          const updatedStock = await this.stockServices.insertMedicineToStock(
            stockId,
            medicineData,
          );
          res.json(updatedStock);
        } catch (error: any) {
          res.status(500).json({ error: error.message });
        }
      },
    );

    // update stock by id
    this.app.patch("/:id", verifyToken, async (req: Request, res: Response) => {
      const stockId = Number(req.params.id);
      const stockData = req.body;
      try {
        const updatedStock = await this.stockServices.updateStockById(
          stockId,
          stockData,
        );
        res.json(updatedStock);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // delete stock by id
    this.app.delete(
      "/:id",
      verifyToken,
      async (req: Request, res: Response) => {
        const stockId = Number(req.params.id);
        try {
          const result = await this.stockServices.deleteStockById(stockId);
          res.json(result);
        } catch (error: any) {
          res.status(500).json({ error: error.message });
        }
      },
    );

    // update medicine in stock
    this.app.patch(
      "/medicine/:medicineId",
      verifyToken,
      async (req: Request, res: Response) => {
        const medicineId = Number(req.params.medicineId);
        const medicineData = req.body;
        try {
          const updatedMedicine =
            await this.stockServices.updateMedicineInStock(
              medicineId,
              medicineData,
            );
          res.json(updatedMedicine);
        } catch (error: any) {
          res.status(500).json({ error: error.message });
        }
      },
    );

    // delete medicine from stock
    this.app.delete(
      "/medicine/:medicineId",
      verifyToken,
      async (req: Request, res: Response) => {
        const medicineId = Number(req.params.medicineId);
        try {
          const result =
            await this.stockServices.deleteMedicineFromStock(medicineId);
          res.json(result);
        } catch (error: any) {
          res.status(500).json({ error: error.message });
        }
      },
    );
  };
}

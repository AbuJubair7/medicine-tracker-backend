import { Stock } from "./entities/stockEntity";
import { AppDataSource } from "../../database/data-source";
import { StockDTO } from "./dto/stock.dto";
import { User } from "../user/entities/userEntity";
import { MedicineDTO } from "./dto/medicine.dto";
import { Medicine } from "./entities/medicineEntity";
import { processAutoDeduction } from "../../helpers/deductionHelper";

export class StockServices {
  constructor(
    private readonly stockRepository = AppDataSource.getRepository(Stock),
    private readonly medicineRepository = AppDataSource.getRepository(Medicine),
  ) {}
  stockGreet = (): string => {
    return "Stock page.... Welcome!";
  };

  // create stock
  createStock = async (userId: number, stock: StockDTO): Promise<any> => {
    const newStock = this.stockRepository.create(stock);
    const user = await AppDataSource.getRepository(User).findOneBy({
      id: userId,
    });
    if (!user) {
      throw new Error("User not found");
    }
    newStock.user = user;
    return await this.stockRepository.save(newStock);
  };

  // get stock by id
  getStockById = async (id: number): Promise<Stock | null> => {
    const stock = await this.stockRepository.findOne({
      where: { id },
      relations: ["medicines"],
    });

    if (stock && stock.medicines) {
      // Process auto-deduction for all medicines
      stock.medicines = await Promise.all(
        stock.medicines.map((med) =>
          processAutoDeduction(med, this.medicineRepository),
        ),
      );
    }

    return stock;
  };

  // get stocks by user id
  getStocksByUserId = async (
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Stock[]; total: number; page: number; limit: number }> => {
    const skip = (page - 1) * limit;
    const [stocks, total] = await this.stockRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ["medicines"],
      skip,
      take: limit,
      order: {
        id: "DESC", // Usually good to order by something consistent
      },
    });

    return {
      data: stocks,
      total,
      page,
      limit,
    };
  };

  //insert medicine to stock
  insertMedicineToStock = async (
    id: number,
    medicineDto: MedicineDTO,
  ): Promise<Stock | null> => {
    const stock = await this.stockRepository.findOne({
      where: { id },
      relations: ["medicines"],
    });
    if (!stock) {
      throw new Error("Stock not found");
    }
    const medicine = this.medicineRepository.create(medicineDto);
    medicine.stock = stock;
    medicine.lastDeductedAt = new Date(); // Initialize timestamp
    await this.medicineRepository.save(medicine);
    // Optionally reload stock with medicines
    return await this.stockRepository.findOne({
      where: { id },
      relations: ["medicines"],
    });
  };

  // update stock by id
  updateStockById = async (
    id: number,
    stockDto: Partial<StockDTO>,
  ): Promise<Stock | null> => {
    const stock = await this.stockRepository.findOneBy({ id });
    if (!stock) {
      throw new Error("Stock not found");
    }
    this.stockRepository.merge(stock, stockDto);
    return await this.stockRepository.save(stock);
  };

  //delete stock by id
  deleteStockById = async (id: number): Promise<{ message: string }> => {
    const stock = await this.stockRepository.findOneBy({ id });
    if (!stock) {
      throw new Error("Stock not found");
    }
    await this.stockRepository.delete(id);
    return { message: "Stock removed successfully" };
  };

  // update medicine in stock
  updateMedicineInStock = async (
    medicineId: number,
    medicineDto: Partial<MedicineDTO>,
  ): Promise<Medicine | null> => {
    const medicine = await this.medicineRepository.findOne({
      where: { id: medicineId },
    });
    if (!medicine) {
      throw new Error("Medicine not found");
    }
    this.medicineRepository.merge(medicine, medicineDto);

    // CRITICAL: Reset lastDeductedAt if quantity is updated manually
    if (medicineDto.quantity !== undefined) {
      medicine.lastDeductedAt = new Date();
    }

    return await this.medicineRepository.save(medicine);
  };

  // delete medicine from stock
  deleteMedicineFromStock = async (
    medicineId: number,
  ): Promise<{ message: string }> => {
    const medicine = await this.medicineRepository.findOne({
      where: { id: medicineId },
    });
    if (!medicine) {
      throw new Error("Medicine not found");
    }
    await this.medicineRepository.delete(medicineId);
    return { message: "Medicine removed successfully" };
  };
}

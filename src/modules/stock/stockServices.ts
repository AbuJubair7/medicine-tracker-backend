import { Stock } from "./entities/stockEntity";
import { AppDataSource } from "../../database/data-source";
import { StockDTO } from "./dto/stock.dto";
import { User } from "../user/entities/userEntity";
import { MedicineDTO } from "./dto/medicine.dto";
import { Medicine } from "./entities/medicineEntity";

export class StockServices {
  constructor(
    private readonly stockRepository = AppDataSource.getRepository(Stock),
    private readonly medicineRepository = AppDataSource.getRepository(Medicine),
  ) {}
  stockGreet = (): string => {
    return "Stock page.... Welcome!";
  };
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
  getStockById = async (id: number): Promise<Stock | null> => {
    return await this.stockRepository.findOne({
      where: { id },
      relations: ["medicines", "user"],
    });
  };
  getStocksByUserId = async (userId: number): Promise<Stock[]> => {
    return await this.stockRepository.find({
      where: { user: { id: userId } },
      relations: ["medicines", "user"],
    });
  };
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
    await this.medicineRepository.save(medicine);
    // Optionally reload stock with medicines
    return await this.stockRepository.findOne({
      where: { id },
      relations: ["medicines", "user"],
    });
  };
}

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
    return await this.stockRepository.findOne({
      where: { id },
      relations: ["medicines", "user"],
    });
  };

  // get stocks by user id
  getStocksByUserId = async (userId: number): Promise<Stock[]> => {
    return await this.stockRepository.find({
      where: { user: { id: userId } },
      relations: ["medicines", "user"],
    });
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
    await this.medicineRepository.save(medicine);
    // Optionally reload stock with medicines
    return await this.stockRepository.findOne({
      where: { id },
      relations: ["medicines", "user"],
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

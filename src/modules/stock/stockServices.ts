import { Stock } from "./entities/stockEntity";
import { AppDataSource } from "../../database/data-source";
import { StockDTO } from "./dto/stock.dto";
import { User } from "../user/entities/userEntity";

export class StockServices {
  constructor(
    private readonly stockRepository = AppDataSource.getRepository(Stock),
  ) {}
  stockGreet = (): string => {
    return "Stock page";
  };
  createStock = async (stock: StockDTO): Promise<any> => {
    const newStock = this.stockRepository.create(stock);
    const user = await AppDataSource.getRepository(User).findOneBy({
      id: stock.userId,
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
  }
}

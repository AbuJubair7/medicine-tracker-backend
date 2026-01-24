import { IsEmail, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class StockDTO {
  @IsNotEmpty({ message: "Stock name is required" })
  name!: string;
}

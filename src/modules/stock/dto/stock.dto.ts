import { IsEmail, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class StockDTO {
  @IsNotEmpty({ message: "Stock name is required" })
  name!: string;

  @IsNotEmpty({ message: "User ID is required" })
  @IsNumber({}, { message: "User ID must be a number" })
  @IsPositive({ message: "User ID must be a positive number" })
  userId!: number;
}

import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class MedicineDTO {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  dose!: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity!: number;

  @IsNotEmpty()
  @IsBoolean()
  takeMorning?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  takeAfternoon?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  takeEvening?: boolean;

}
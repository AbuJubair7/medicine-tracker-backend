import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, Max, Min } from "class-validator";

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

  @IsOptional()
  @IsNumber()
  @Min(6)
  @Max(11)
  morningTime?: number;

  @IsNotEmpty()
  @IsBoolean()
  takeAfternoon?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(12)
  @Max(18)
  afternoonTime?: number;

  @IsNotEmpty()
  @IsBoolean()
  takeEvening?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(19)
  @Max(23)
  eveningTime?: number;

}
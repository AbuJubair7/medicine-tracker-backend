import { Repository } from "typeorm";
import { Medicine } from "../modules/stock/entities/medicineEntity";

var MORNING_TIME: number = 9;
var AFTERNOON_TIME: number = 14;
var EVENING_TIME: number = 21;

export const processAutoDeduction = async (
  medicine: Medicine,
  medicineRepository: Repository<Medicine>,
): Promise<Medicine> => {
  MORNING_TIME = medicine.morningTime || MORNING_TIME;
  AFTERNOON_TIME = medicine.afternoonTime || AFTERNOON_TIME;
  EVENING_TIME = medicine.eveningTime || EVENING_TIME;

  const now = new Date();
  const lastCheck = new Date(medicine.lastDeductedAt);

  if (lastCheck >= now) return medicine;

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  let quantityToDeduct = 0;

  const countOccurrences = (
    start: Date,
    end: Date,
    targetHour: number,
  ): number => {
    const firstOccurrence = new Date(start);
    if (firstOccurrence.getHours() < targetHour) {
      firstOccurrence.setDate(firstOccurrence.getDate() - 1);
    }
    firstOccurrence.setHours(targetHour, 0, 0, 0);

    if (firstOccurrence > end) return 0;

    const timeDiff = end.getTime() - firstOccurrence.getTime();
    return Math.floor(timeDiff / MS_PER_DAY);
  };

  if (medicine.takeMorning) {
    quantityToDeduct += countOccurrences(lastCheck, now, MORNING_TIME);
  }
  if (medicine.takeAfternoon) {
    quantityToDeduct += countOccurrences(lastCheck, now, AFTERNOON_TIME);
  }
  if (medicine.takeEvening) {
    quantityToDeduct += countOccurrences(lastCheck, now, EVENING_TIME);
  }

  if (quantityToDeduct === 0) {
    return medicine;
  }

  medicine.quantity = Math.max(0, medicine.quantity - quantityToDeduct);
  medicine.lastDeductedAt = new Date();
  return await medicineRepository.save(medicine);
};

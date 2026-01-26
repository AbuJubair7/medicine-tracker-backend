import { Repository } from "typeorm";
import { Medicine } from "../modules/stock/entities/medicineEntity";

const MORNING_TIME = 9;
const AFTERNOON_TIME = 14;
const EVENING_TIME = 21;

export const processAutoDeduction = async (
  medicine: Medicine,
  medicineRepository: Repository<Medicine>,
): Promise<Medicine> => {
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

  medicine.quantity = Math.max(0, medicine.quantity - quantityToDeduct);
  medicine.lastDeductedAt = now;
  return await medicineRepository.save(medicine);
};

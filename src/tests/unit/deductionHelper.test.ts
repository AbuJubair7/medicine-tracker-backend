import { processAutoDeduction } from "../../helpers/deductionHelper";
import { DateUtil } from "../../utils/DateUtil";
import { Medicine } from "../../modules/stock/entities/medicineEntity";

const dayMs = 24 * 60 * 60 * 1000;

const buildMedicine = (overrides: Partial<Medicine> = {}): Medicine => ({
  id: 1,
  name: "Med",
  dose: 1,
  quantity: 10,
  takeMorning: true,
  takeAfternoon: true,
  takeEvening: true,
  createdAt: new Date("2024-02-10T00:00:00Z"),
  lastDeductedAt: new Date("2024-02-10T09:00:00Z"),
  stock: undefined as any,
  ...overrides,
});

const buildRepo = () => ({
  save: jest.fn(async (med: Medicine) => med),
});

describe("processAutoDeduction", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns unchanged medicine when lastDeductedAt is in the future", async () => {
    const repo = buildRepo();
    jest
      .spyOn(DateUtil, "nowBD")
      .mockReturnValue(new Date("2024-02-10T08:00:00Z"));

    const medicine = buildMedicine({
      lastDeductedAt: new Date("2024-02-10T09:00:00Z"),
    });

    const result = await processAutoDeduction(medicine, repo as any);
    expect(result.quantity).toBe(medicine.quantity);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it("does not deduct when still before the first target hour of the same day", async () => {
    const repo = buildRepo();
    jest
      .spyOn(DateUtil, "nowBD")
      .mockReturnValue(new Date("2024-02-10T08:30:00Z"));

    const medicine = buildMedicine({
      takeMorning: true,
      takeAfternoon: false,
      takeEvening: false,
      lastDeductedAt: new Date("2024-02-10T08:00:00Z"),
    });

    const result = await processAutoDeduction(medicine, repo as any);
    expect(result.quantity).toBe(10);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it("deducts once after passing the morning target hour", async () => {
    const repo = buildRepo();
    jest
      .spyOn(DateUtil, "nowBD")
      .mockReturnValue(new Date("2024-02-10T10:00:00Z"));

    const medicine = buildMedicine({
      takeMorning: true,
      takeAfternoon: false,
      takeEvening: false,
      lastDeductedAt: new Date("2024-02-10T08:00:00Z"),
    });

    const result = await processAutoDeduction(medicine, repo as any);
    expect(result.quantity).toBe(9);
    expect(result.lastDeductedAt.toISOString()).toBe(
      "2024-02-10T10:00:00.000Z",
    );
    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it("deducts across days for all enabled slots", async () => {
    const repo = buildRepo();
    jest
      .spyOn(DateUtil, "nowBD")
      .mockReturnValue(new Date("2024-02-11T22:00:00Z"));

    const medicine = buildMedicine({
      lastDeductedAt: new Date("2024-02-10T08:00:00Z"),
      quantity: 12,
    });

    const result = await processAutoDeduction(medicine, repo as any);
    // Expected: Morning (2), Afternoon (2), Evening (2) = 6 total
    expect(result.quantity).toBe(6);
    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it("respects individual flags (evening only)", async () => {
    const repo = buildRepo();
    jest
      .spyOn(DateUtil, "nowBD")
      .mockReturnValue(new Date("2024-02-14T20:30:00Z"));

    const medicine = buildMedicine({
      takeMorning: false,
      takeAfternoon: false,
      takeEvening: true,
      quantity: 5,
      lastDeductedAt: new Date("2024-02-12T20:00:00Z"),
    });

    const result = await processAutoDeduction(medicine, repo as any);
    // Evenings on Feb 12 and 13 (two occurrences), not yet Feb 14 21:00
    expect(result.quantity).toBe(3);
    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it("never drops quantity below zero", async () => {
    const repo = buildRepo();
    jest
      .spyOn(DateUtil, "nowBD")
      .mockReturnValue(new Date("2024-02-13T22:00:00Z"));

    const medicine = buildMedicine({
      quantity: 1,
      lastDeductedAt: new Date("2024-02-12T08:00:00Z"),
    });

    const result = await processAutoDeduction(medicine, repo as any);
    expect(result.quantity).toBe(0);
  });

  it("skips saving when no deduction occurs (all flags false)", async () => {
    const repo = buildRepo();
    jest
      .spyOn(DateUtil, "nowBD")
      .mockReturnValue(new Date("2024-02-12T10:00:00Z"));

    const medicine = buildMedicine({
      takeMorning: false,
      takeAfternoon: false,
      takeEvening: false,
    });

    const result = await processAutoDeduction(medicine, repo as any);
    expect(result.quantity).toBe(10);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it("counts an occurrence exactly on the target boundary", async () => {
    const repo = buildRepo();
    jest
      .spyOn(DateUtil, "nowBD")
      .mockReturnValue(new Date("2024-02-11T09:00:00Z"));

    const medicine = buildMedicine({
      takeMorning: true,
      takeAfternoon: false,
      takeEvening: false,
      lastDeductedAt: new Date("2024-02-10T09:00:00Z"),
      quantity: 3,
    });

    const result = await processAutoDeduction(medicine, repo as any);
    expect(result.quantity).toBe(2);
    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it("is idempotent when called again with the same now", async () => {
    const repo = buildRepo();
    const fixedNow = new Date("2024-02-11T10:00:00Z");
    jest.spyOn(DateUtil, "nowBD").mockReturnValue(fixedNow);

    const medicine = buildMedicine({
      takeMorning: true,
      takeAfternoon: false,
      takeEvening: false,
      lastDeductedAt: new Date("2024-02-10T08:00:00Z"),
      quantity: 4,
    });

    const once = await processAutoDeduction(medicine, repo as any);
    const twice = await processAutoDeduction(once, repo as any);

    expect(once.quantity).toBe(2);
    expect(twice.quantity).toBe(2);
    expect(repo.save).toHaveBeenCalledTimes(1);
  });
});

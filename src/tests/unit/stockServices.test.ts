import { StockServices } from "../../modules/stock/stockServices";


describe("StockServices", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("throws when medicine is not found", async () => {
    const stockRepo: any = {};
    const medicineRepo: any = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const services = new StockServices(stockRepo, medicineRepo);

    await expect(
      services.updateMedicineInStock(1, { name: "New" }),
    ).rejects.toThrow("Medicine not found");
  });

  it("resets lastDeductedAt when quantity is updated", async () => {
    const fixedDate = new Date("2024-02-10T10:00:00Z");
    jest.useFakeTimers().setSystemTime(fixedDate);

    const medicine = {
      id: 1,
      name: "Med",
      quantity: 10,
      lastDeductedAt: new Date("2024-02-01T10:00:00Z"),
    } as any;

    const stockRepo: any = {};
    const medicineRepo: any = {
      findOne: jest.fn().mockResolvedValue(medicine),
      merge: jest.fn((entity: any, data: any) => Object.assign(entity, data)),
      save: jest.fn(async (entity: any) => entity),
    };

    const services = new StockServices(stockRepo, medicineRepo);
    const result = await services.updateMedicineInStock(1, { quantity: 5 });

    expect(result?.quantity).toBe(5);
    expect(result?.lastDeductedAt).toEqual(fixedDate);
    expect(medicineRepo.save).toHaveBeenCalledWith(medicine);
  });

  it("does not reset lastDeductedAt when quantity is not updated", async () => {
    const originalDate = new Date("2024-02-01T10:00:00Z");
    jest.useFakeTimers().setSystemTime(new Date("2024-02-15T10:00:00Z")); // Some future date
    const medicine = {
      id: 1,
      name: "Med",
      quantity: 10,
      lastDeductedAt: originalDate,
    } as any;

    const stockRepo: any = {};
    const medicineRepo: any = {
      findOne: jest.fn().mockResolvedValue(medicine),
      merge: jest.fn((entity: any, data: any) => Object.assign(entity, data)),
      save: jest.fn(async (entity: any) => entity),
    };

    const services = new StockServices(stockRepo, medicineRepo);
    const result = await services.updateMedicineInStock(1, { name: "New" });

    expect(result?.lastDeductedAt).toEqual(originalDate);
    jest.useRealTimers();
  });

  it("creates medicine and sets timestamps on insertMedicineToStock", async () => {
    const fixedDate = new Date("2024-02-12T08:00:00Z");
    jest.useFakeTimers().setSystemTime(fixedDate);

    const stock = { id: 7 };

    const stockRepo: any = {
      findOne: jest.fn().mockResolvedValue(stock),
    };
    const medicineRepo: any = {
      create: jest.fn((data: any) => ({ ...data })),
      save: jest.fn(async (entity: any) => ({ ...entity, id: 99 })),
    };

    const services = new StockServices(stockRepo, medicineRepo);
    const result = await services.insertMedicineToStock(7, {
      name: "Med",
      dose: 1,
      quantity: 3,
      takeMorning: true,
      takeAfternoon: false,
      takeEvening: true,
    });

    expect(result.id).toBe(99);
    expect(medicineRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        stock,
        createdAt: fixedDate,
        lastDeductedAt: fixedDate,
      }),
    );
  });
});

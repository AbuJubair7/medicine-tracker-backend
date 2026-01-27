import { processAutoDeduction } from '../helpers/deductionHelper';
import { Medicine } from '../modules/stock/entities/medicineEntity';

// Mock Repository
const mockRepo: any = {
  save: async (med: Medicine) => med,
};

// ------------- DATE MOCKING UTILITIES ----------------
const RealDate = Date;

function mockSystemTime(isoDate: string) {
  const forcedTime = new RealDate(isoDate);
  
  // @ts-ignore
  global.Date = class extends RealDate {
    constructor(...args: any[]) {
      super();
      if (args.length) {
        // @ts-ignore
        return new RealDate(...args);
      }
      return forcedTime;
    }
    
    // Support Date.now()
    static now() {
      return forcedTime.getTime();
    }
  };
}

function restoreSystemTime() {
  global.Date = RealDate;
}
// -----------------------------------------------------

async function runTests() {
  console.log("Starting Critical Edge Case Tests (With Global Date Mocking)...\n");
  let passed = 0;
  let failed = 0;

  const assert = async (
    description: string,
    initialQuantity: number,
    lastCheck: Date, // Real Date object (created before mocking or using RealDate)
    mockNowIso: string, // ISO string to freeze "Now" to
    schedule: { morning?: boolean; noon?: boolean; evening?: boolean },
    expectedDeduction: number,
    expectQuantity?: number
  ) => {
    // 1. Freeze Time
    mockSystemTime(mockNowIso);

    const med = new Medicine();
    med.quantity = initialQuantity;
    med.lastDeductedAt = lastCheck;
    med.takeMorning = schedule.morning ?? false;
    med.takeAfternoon = schedule.noon ?? false;
    med.takeEvening = schedule.evening ?? false;

    // 2. Run Test (Helper calls new Date() which is now frozen)
    let result;
    try {
      result = await processAutoDeduction(med, mockRepo);
    } catch (e) {
      console.error(`❌ ERROR: ${description}`, e);
      restoreSystemTime();
      failed++;
      return;
    }

    // 3. Restore Time immediately
    restoreSystemTime();

    const actualDeduction = initialQuantity - result.quantity;
    let success = (actualDeduction === expectedDeduction);
    if (expectQuantity !== undefined) {
      success = success && (result.quantity === expectQuantity);
    }

    if (success) {
      console.log(`✅ PASS: ${description}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${description}`);
      console.error(`   Expected Deducted: ${expectedDeduction}, Actual: ${actualDeduction}`);
      console.error(`   Last Check: ${lastCheck.toISOString()}`);
      console.error(`   Mock Now:   ${mockNowIso}`);
      failed++;
    }
  };

  // Use RealDate for creating input dates so they aren't affected by the mock locally
  const d = (iso: string) => new RealDate(iso);

  // 1. EXACT BOUNDARY: Morning Dose (09:00)
  // Check at 08:59 -> Now 09:01 (Should deduct 1)
  await assert(
    "Boundary: Crossing 09:00 AM (8:59 -> 9:01)",
    100,
    d("2023-10-10T08:59:00"),
    "2023-10-10T09:01:00",
    { morning: true },
    1
  );

  // Check at 09:01 -> Now 09:02 (Should deduct 0)
  await assert(
    "Boundary: After 09:00 AM (9:01 -> 9:02)",
    100,
    d("2023-10-10T09:01:00"),
    "2023-10-10T09:02:00",
    { morning: true },
    0
  );

  // 2. YEAR BOUNDARY: Dec 31 -> Jan 1
  await assert(
    "Year Boundary: Dec 31 23:00 -> Jan 1 10:00 (Morning Dose)",
    100,
    d("2023-12-31T23:00:00"),
    "2024-01-01T10:00:00",
    { morning: true },
    1
  );

  // 3. LEAP YEAR
  await assert(
    "Leap Year: Feb 28 23:00 -> Mar 1 10:00 (2024 Leap, Morning Only)",
    100,
    d("2024-02-28T23:00:00"),
    "2024-03-01T10:00:00",
    { morning: true },
    2 // Feb 29 (1) + Mar 1 (1)
  );
  
  // Non-Leap Year
  await assert(
    "Non-Leap Year: Feb 28 23:00 -> Mar 1 10:00 (2023 Non-Leap, Morning Only)",
    100,
    d("2023-02-28T23:00:00"),
    "2023-03-01T10:00:00",
    { morning: true },
    1
  );

  // 4. ZERO QUANTITY PROTECTION
  await assert(
    "Zero Quantity Protection",
    5,
    d("2023-01-01T00:00:00"),
    "2023-01-10T00:00:00",
    { morning: true, noon: true, evening: true },
    5, 
    0 
  );

  // 5. DOUBLE BOUNDARY
  await assert(
    "Double Boundary: 08:00 -> 15:00 (Morning + Noon)",
    100,
    d("2023-10-10T08:00:00"),
    "2023-10-10T15:00:00",
    { morning: true, noon: true },
    2
  );

  console.log(`\nCritical Tests Complete: ${passed} Passed, ${failed} Failed.`);
}

runTests();

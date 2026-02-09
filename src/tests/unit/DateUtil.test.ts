import { DateUtil } from "../../utils/DateUtil";

describe("DateUtil", () => {
  describe("toBD", () => {
    it("should convert a UTC date to Bangladesh time correctly", () => {
      // 2024-02-09T09:00:00Z in UTC
      // Bangladesh is UTC+6, so it should be 2024-02-09T15:00:00
      const utcDate = new Date("2024-02-09T09:00:00Z");
      const bdDate = DateUtil.toBD(utcDate);

      expect(bdDate.getUTCFullYear()).toBe(2024);
      expect(bdDate.getUTCMonth()).toBe(1); // February is 1
      expect(bdDate.getUTCDate()).toBe(9);
      expect(bdDate.getUTCHours()).toBe(15);
      expect(bdDate.getUTCMinutes()).toBe(0);
      expect(bdDate.getUTCSeconds()).toBe(0);
    });

    it("should handle string input", () => {
      const dateString = "2024-02-09T09:00:00Z";
      const bdDate = DateUtil.toBD(dateString);
      expect(bdDate.getUTCHours()).toBe(15);
    });
  });

  describe("nowBD", () => {
    it("should return a date object", () => {
      const now = DateUtil.nowBD();
      expect(now).toBeInstanceOf(Date);
    });
  });
});

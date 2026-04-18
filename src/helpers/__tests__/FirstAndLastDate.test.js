import getFirstAndLastDateOfMonth from "../FirstAndLastDate";

describe("getFirstAndLastDateOfMonth", () => {
  it("should return first and last date of January", () => {
    const result = getFirstAndLastDateOfMonth(2024, 1);
    expect(result.firstDate).toBe("2024-1-1");
    expect(result.lastDate).toBe("2024-1-31");
  });

  it("should return correct last date for February (leap year)", () => {
    const result = getFirstAndLastDateOfMonth(2024, 2);
    expect(result.firstDate).toBe("2024-2-1");
    expect(result.lastDate).toBe("2024-2-29"); // 2024 is leap year
  });

  it("should return correct last date for February (non-leap year)", () => {
    const result = getFirstAndLastDateOfMonth(2023, 2);
    expect(result.lastDate).toBe("2023-2-28");
  });

  it("should handle December", () => {
    const result = getFirstAndLastDateOfMonth(2024, 12);
    expect(result.firstDate).toBe("2024-12-1");
    expect(result.lastDate).toBe("2024-12-31");
  });

  it("should handle months with 30 days (April)", () => {
    const result = getFirstAndLastDateOfMonth(2024, 4);
    expect(result.lastDate).toBe("2024-4-30");
  });
});

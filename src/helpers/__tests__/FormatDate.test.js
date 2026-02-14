import FormatDate from "../FormatDate";

describe("FormatDate", () => {
  it("should format ISO date string to 'day month year'", () => {
    const result = FormatDate("2024-01-15");
    expect(result).toContain("15");
    expect(result).toContain("January");
    expect(result).toContain("2024");
  });

  it("should format date with different months", () => {
    const result = FormatDate("2024-06-01");
    expect(result).toContain("June");
    expect(result).toContain("2024");
  });

  it("should handle end-of-year date", () => {
    const result = FormatDate("2024-12-31");
    expect(result).toContain("December");
    expect(result).toContain("2024");
  });

  it("should handle Date object input", () => {
    const result = FormatDate(new Date(2024, 0, 1)); // Jan 1
    expect(result).toContain("January");
    expect(result).toContain("2024");
  });
});

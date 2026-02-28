import FormatPeriod from "../FormatPeriod";

describe("FormatPeriod", () => {
  it("formats same month and year correctly (long)", () => {
    expect(FormatPeriod("2026-01-14", "2026-01-28", false)).toBe(
      "Januari 2026",
    );
  });

  it("formats same month and year correctly (short)", () => {
    expect(FormatPeriod("2026-01-14", "2026-01-28", true)).toBe("Jan 2026");
  });

  it("formats different months in the same year correctly (long)", () => {
    expect(FormatPeriod("2026-01-14", "2026-02-14", false)).toBe(
      "Januari - Februari 2026",
    );
  });

  it("formats different months in the same year correctly (short)", () => {
    expect(FormatPeriod("2026-01-14", "2026-02-14", true)).toBe(
      "Jan - Feb 2026",
    );
  });

  it("formats different years correctly (long)", () => {
    expect(FormatPeriod("2025-12-14", "2026-02-14", false)).toBe(
      "Desember 2025 - Februari 2026",
    );
  });

  it("formats different years correctly (short)", () => {
    expect(FormatPeriod("2025-12-14", "2026-02-14", true)).toBe(
      "Des 2025 - Feb 2026",
    );
  });

  it("handles empty or invalid inputs gracefully", () => {
    expect(FormatPeriod("", "2026-01-14")).toBe("");
  });
});

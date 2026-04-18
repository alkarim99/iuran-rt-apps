import FormatCurrency from "../FormatCurrency";

describe("FormatCurrency", () => {
  it("should format small number", () => {
    expect(FormatCurrency(1000)).toBe("Rp 1.000");
  });

  it("should format typical iuran amount", () => {
    expect(FormatCurrency(75000)).toBe("Rp 75.000");
  });

  it("should format full tier amount", () => {
    expect(FormatCurrency(110000)).toBe("Rp 110.000");
  });

  it("should format large amount with multiple separators", () => {
    expect(FormatCurrency(1500000)).toBe("Rp 1.500.000");
  });

  it("should format millions", () => {
    expect(FormatCurrency(6990000)).toBe("Rp 6.990.000");
  });

  it("should handle zero", () => {
    expect(FormatCurrency(0)).toBe("Rp 0");
  });

  it("should handle undefined gracefully", () => {
    const result = FormatCurrency(undefined);
    expect(result).toBe("Rp undefined");
  });
});

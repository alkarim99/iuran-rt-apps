import { buildUrl } from "../urlBuilder";

jest.mock("../../services/config", () => ({
  BASE_URL: "http://localhost:3000",
}));

describe("buildUrl", () => {
  const BASE = "http://localhost:3000";

  it("should build URL with path only", () => {
    const result = buildUrl("/wargas");
    expect(result).toBe(`${BASE}/wargas`);
  });

  it("should build URL with query params", () => {
    const result = buildUrl("/wargas", { page: 1, limit: 10 });
    expect(result).toContain("http://localhost:3000/wargas?");
    expect(result).toContain("page=1");
    expect(result).toContain("limit=10");
  });

  it("should skip undefined/empty params", () => {
    const result = buildUrl("/wargas", {
      page: 1,
      keyword: "",
      sortBy: undefined,
    });
    expect(result).toContain("page=1");
    expect(result).not.toContain("keyword");
    expect(result).not.toContain("sortBy");
  });

  it("should handle zero as valid param", () => {
    const result = buildUrl("/wargas", { page: 0 });
    expect(result).toContain("page=0");
  });
});

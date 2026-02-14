import { render, screen, fireEvent } from "@testing-library/react";
import PrintButton from "../PrintButton";

// Mock window.print
const mockPrint = jest.fn();
Object.defineProperty(window, "print", { value: mockPrint });

describe("PrintButton", () => {
  beforeEach(() => {
    mockPrint.mockClear();
  });

  it("should render with default label", () => {
    render(<PrintButton />);
    expect(screen.getByText("Cetak")).toBeInTheDocument();
  });

  it("should render with custom label", () => {
    render(<PrintButton label="Cetak Laporan Cash" />);
    expect(screen.getByText("Cetak Laporan Cash")).toBeInTheDocument();
  });

  it("should call window.print on click", () => {
    render(<PrintButton />);
    fireEvent.click(screen.getByText("Cetak"));
    expect(mockPrint).toHaveBeenCalledTimes(1);
  });

  it("should have no-print CSS class", () => {
    render(<PrintButton />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("no-print");
  });
});

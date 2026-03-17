/**
 * Shared constants and helpers for ExcelJS-based report exports.
 */

export const BULAN_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

// ── Styling presets ──────────────────────────────────────────────

export const BORDER_THIN = {
  top: { style: "thin" },
  bottom: { style: "thin" },
  left: { style: "thin" },
  right: { style: "thin" },
};

export const BORDER_MEDIUM_TB = {
  top: { style: "medium" },
  bottom: { style: "medium" },
  left: { style: "thin" },
  right: { style: "thin" },
};

export const HEADER_FILL = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD3D3D3" }, // light grey
};

export const TOTAL_FILL = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFFFFF99" }, // light yellow
};

export const FONT_TITLE = { bold: true, size: 12 };
export const FONT_SUBTITLE = { bold: true, size: 11 };
export const FONT_HEADER = { bold: true, size: 11 };
export const FONT_DATA = { size: 10 };
export const FONT_TOTAL = { bold: true, size: 10 };

export const ALIGN_CENTER = {
  horizontal: "center",
  vertical: "middle",
  wrapText: true,
};
export const ALIGN_LEFT = { horizontal: "left", vertical: "middle" };
export const ALIGN_RIGHT = { horizontal: "right", vertical: "middle" };

// Excel-native Rupiah number formats (keeps values numeric & summable)
export const FMT_RUPIAH = '"Rp"#,##0.00';
export const FMT_RUPIAH_NO_DEC = '"Rp"#,##0';

// ── Institusi header text ────────────────────────────────────────

export const INSTITUSI_HEADER = {
  petty_cash: {
    judul: "DANA PETTYCASH",
    subLabel: "PENERIMAAN IURAN CASH DAN PENGELUARAN",
  },
  rekening: {
    judul: "DANA KAS DI TABUNGAN/REKENING BCA",
    subLabel: "PENERIMAAN IURAN WARGA VIA REKENING",
  },
};

export const INSTITUSI_LINE2 = "BENDAHARA RT08 RW11 LINGKUNGAN ARAYA";
export const INSTITUSI_LINE3 =
  "KELURAHAN PURWODADI KECAMATAN BLIMBING KOTA MALANG";

// ── Helper functions ─────────────────────────────────────────────

/**
 * Apply thin borders to every cell in a row (from col 1..colCount).
 */
export function applyBorderToRow(row, colCount, border = BORDER_THIN) {
  for (let c = 1; c <= colCount; c++) {
    row.getCell(c).border = border;
  }
}

/**
 * Apply style preset to an entire row.
 */
export function styleRow(
  row,
  colCount,
  { font, fill, alignment, border, numFmt } = {},
) {
  for (let c = 1; c <= colCount; c++) {
    const cell = row.getCell(c);
    if (font) cell.font = font;
    if (fill) cell.fill = fill;
    if (alignment) cell.alignment = alignment;
    if (border) cell.border = border;
    if (numFmt) cell.numFmt = numFmt;
  }
}

/**
 * Trigger file download in the browser from an ExcelJS workbook.
 */
export async function downloadWorkbook(workbook, fileName) {
  const { saveAs } = await import("file-saver");
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${fileName}.xlsx`);
}

/**
 * Format B — "PERINCIAN PEMBAGIAN UANG IURAN"
 *
 * Generates a styled Excel report for the monthly iuran breakdown per warga.
 * Runs entirely client-side using ExcelJS.
 *
 * @param {Array}  data    - Payment records from searchPaymentsRincian API
 * @param {{bulan: number, tahun: number}} periode
 */
import ExcelJS from "exceljs";
import {
  BULAN_ID,
  INSTITUSI_LINE3,
  BORDER_THIN,
  BORDER_MEDIUM_TB,
  HEADER_FILL,
  TOTAL_FILL,
  FONT_TITLE,
  FONT_SUBTITLE,
  FONT_HEADER,
  FONT_DATA,
  FONT_TOTAL,
  ALIGN_CENTER,
  ALIGN_LEFT,
  ALIGN_RIGHT,
  FMT_RUPIAH_NO_DEC,
  applyBorderToRow,
  styleRow,
  downloadWorkbook,
} from "./exportConfig";

const COL_COUNT = 11;
// A=Blok B=Nama C=Alamat D=TglBayar E=Jumlah F=PeriodeBulan G=RT H=PKK I=Sosial J=Kematian K=Keterangan

export async function exportRincianIuran(data, periode) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Rincian Iuran");

  const namaBulan = BULAN_ID[periode.bulan - 1];

  // ── Column widths ──────────────────────────────────────────────
  ws.columns = [
    { width: 8 }, // A — Blok
    { width: 30 }, // B — Nama
    { width: 12 }, // C — Alamat
    { width: 14 }, // D — Tanggal Bayar
    { width: 18 }, // E — Jumlah
    { width: 14 }, // F — Periode Bulan
    { width: 16 }, // G — RT
    { width: 14 }, // H — PKK
    { width: 14 }, // I — Sosial
    { width: 14 }, // J — Kematian
    { width: 22 }, // K — Keterangan
  ];

  // ── Header rows ────────────────────────────────────────────────
  const r1 = ws.addRow(["LAPORAN KAS BENDAHARA"]);
  ws.mergeCells(1, 1, 1, COL_COUNT);
  r1.getCell(1).font = FONT_TITLE;

  const r2 = ws.addRow(["RT 08 RW 11 LINGKUNGAN PONDOK BLIMBING INDAH"]);
  ws.mergeCells(2, 1, 2, COL_COUNT);
  r2.getCell(1).font = FONT_SUBTITLE;

  const r3 = ws.addRow([INSTITUSI_LINE3]);
  ws.mergeCells(3, 1, 3, COL_COUNT);
  r3.getCell(1).font = FONT_SUBTITLE;

  ws.addRow([]); // Row 4 blank

  const r5 = ws.addRow(["PERINCIAN PEMBAGIAN UANG IURAN"]);
  ws.mergeCells(5, 1, 5, COL_COUNT);
  r5.getCell(1).font = FONT_SUBTITLE;

  ws.addRow([]); // Row 6 blank

  const r7 = ws.addRow([
    `PERIODE : ${namaBulan.toUpperCase()} ${periode.tahun}`,
  ]);
  ws.mergeCells(7, 1, 7, COL_COUNT);
  r7.getCell(1).font = FONT_SUBTITLE;

  ws.addRow([]); // Row 8 blank

  // ── Table header (row 9) ──────────────────────────────────────
  const headers = [
    "BLOK",
    "NAMA",
    "ALAMAT",
    "TANGGAL BAYAR",
    "JUMLAH",
    "PERIODE BULAN",
    "RT",
    "PKK",
    "SOSIAL",
    "KEMATIAN",
    "KETERANGAN",
  ];
  const headerRow = ws.addRow(headers);
  styleRow(headerRow, COL_COUNT, {
    font: FONT_HEADER,
    fill: HEADER_FILL,
    alignment: ALIGN_CENTER,
    border: BORDER_THIN,
  });
  headerRow.height = 30;

  // ── Data rows ─────────────────────────────────────────────────
  let totalJumlah = 0;
  let totalRT = 0;
  let totalPKK = 0;
  let totalSosial = 0;
  let totalKematian = 0;
  let lastBlok = null;

  data.forEach((iuran) => {
    const addressParts = (iuran?.warga?.address || "").split("-");
    const blokRaw = addressParts[0] || "";
    const showBlok = blokRaw !== lastBlok ? blokRaw : "";
    lastBlok = blokRaw;

    const dayPart = iuran?.pay_at ? new Date(iuran.pay_at).getDate() : null;
    const nominal = iuran?.nominal || 0;
    const periodeBulan = iuran?.number_of_period || null;
    const rt = iuran?.details_payment?.rt || 0;
    const pkk = iuran?.details_payment?.pkk || 0;
    const sosial = iuran?.details_payment?.sosial || 0;
    const kematian = iuran?.details_payment?.kematian || 0;

    totalJumlah += nominal;
    totalRT += rt;
    totalPKK += pkk;
    totalSosial += sosial;
    totalKematian += kematian;

    // Build keterangan from period
    const keterangan = buildKeterangan(iuran?.period_start, iuran?.period_end);

    const row = ws.addRow([
      showBlok,
      iuran?.warga?.name || "",
      iuran?.warga?.address || "",
      dayPart,
      nominal > 0 ? nominal : null,
      periodeBulan,
      rt > 0 ? rt : null,
      pkk > 0 ? pkk : null,
      sosial > 0 ? sosial : null,
      kematian > 0 ? kematian : null,
      keterangan,
    ]);

    styleDataRow(row);
  });

  // ── Total footer row ──────────────────────────────────────────
  const footerRow = ws.addRow([
    "",
    "",
    "",
    "TOTAL",
    totalJumlah,
    "",
    totalRT,
    totalPKK,
    totalSosial,
    totalKematian,
    "",
  ]);
  styleRow(footerRow, COL_COUNT, {
    font: FONT_TOTAL,
    fill: TOTAL_FILL,
    alignment: ALIGN_CENTER,
    border: BORDER_MEDIUM_TB,
  });
  // Rupiah format for numeric columns
  [5, 7, 8, 9, 10].forEach((c) => {
    footerRow.getCell(c).numFmt = FMT_RUPIAH_NO_DEC;
    footerRow.getCell(c).alignment = ALIGN_RIGHT;
  });

  // ── Download ───────────────────────────────────────────────────
  const fileName = `Rincian_Iuran_${namaBulan}${periode.tahun}`;
  await downloadWorkbook(wb, fileName);
}

// ── Internal helpers ─────────────────────────────────────────────

function styleDataRow(row) {
  for (let c = 1; c <= COL_COUNT; c++) {
    const cell = row.getCell(c);
    cell.font = FONT_DATA;
    cell.border = BORDER_THIN;
    // Numeric columns: E=Jumlah, G=RT, H=PKK, I=Sosial, J=Kematian
    if ([5, 7, 8, 9, 10].includes(c)) {
      cell.numFmt = FMT_RUPIAH_NO_DEC;
      cell.alignment = ALIGN_RIGHT;
    } else if (c === 4 || c === 6) {
      // D=Tgl, F=PeriodeBulan — center
      cell.alignment = ALIGN_CENTER;
    } else {
      cell.alignment = ALIGN_LEFT;
    }
  }
}

function buildKeterangan(periodStart, periodEnd) {
  if (!periodStart || !periodEnd) return "";
  const start = new Date(periodStart);
  const end = new Date(periodEnd);
  const startMonth = BULAN_ID[start.getMonth()];
  const endMonth = BULAN_ID[end.getMonth()];
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startYear}`;
  }
  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
}

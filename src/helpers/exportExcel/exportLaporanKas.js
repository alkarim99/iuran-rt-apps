/**
 * Format A — "DANA PETTYCASH" / "DANA KAS DI TABUNGAN/REKENING BCA"
 *
 * Generates a styled Excel report matching the bendahara's manual format.
 * Runs entirely client-side using ExcelJS.
 *
 * @param {Array}  transactions - API response array: [{date, description, debit, kredit, saldo}]
 * @param {string} type         - "petty_cash" | "rekening"
 * @param {{bulan: number, tahun: number}} periode
 * @param {number} saldoAwal    - Opening balance (default 0 until Prompt 1 lands)
 */
import ExcelJS from "exceljs";
import {
  BULAN_ID,
  INSTITUSI_HEADER,
  INSTITUSI_LINE2,
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
  FMT_RUPIAH,
  applyBorderToRow,
  styleRow,
  downloadWorkbook,
} from "./exportConfig";

const COL_COUNT = 7; // A..G
// Column layout:  A=Bulan  B=Tgl  C-D=Keterangan(merge)  E=Debet  F=Kredit  G=Saldo

export async function exportLaporanKas(
  transactions,
  type,
  periode,
  saldoAwal = 0,
) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Laporan");

  const info = INSTITUSI_HEADER[type] || INSTITUSI_HEADER.petty_cash;
  const namaBulan = BULAN_ID[periode.bulan - 1];

  // ── Column widths ──────────────────────────────────────────────
  ws.columns = [
    { width: 12 }, // A — Bulan
    { width: 8 }, // B — Tanggal
    { width: 20 }, // C — Keterangan part 1
    { width: 25 }, // D — Keterangan part 2
    { width: 20 }, // E — Debet
    { width: 20 }, // F — Kredit
    { width: 20 }, // G — Saldo
  ];

  // ── Header rows (1–7) ─────────────────────────────────────────
  // Row 1 — Judul
  const r1 = ws.addRow([info.judul]);
  ws.mergeCells(1, 1, 1, COL_COUNT);
  r1.getCell(1).font = FONT_TITLE;

  // Row 2 — Institusi
  const r2 = ws.addRow([INSTITUSI_LINE2]);
  ws.mergeCells(2, 1, 2, COL_COUNT);
  r2.getCell(1).font = FONT_SUBTITLE;

  // Row 3 — Alamat
  const r3 = ws.addRow([INSTITUSI_LINE3]);
  ws.mergeCells(3, 1, 3, COL_COUNT);
  r3.getCell(1).font = FONT_SUBTITLE;

  // Row 4 — "LAPORAN KEUANGAN"
  const r4 = ws.addRow(["LAPORAN KEUANGAN"]);
  ws.mergeCells(4, 1, 4, COL_COUNT);
  r4.getCell(1).font = FONT_SUBTITLE;

  // Row 5 — Sub-label
  const r5 = ws.addRow([info.subLabel]);
  ws.mergeCells(5, 1, 5, COL_COUNT);
  r5.getCell(1).font = FONT_SUBTITLE;

  // Row 6 — Periode
  const r6 = ws.addRow([
    `PERIODE : ${namaBulan.toUpperCase()} ${periode.tahun}`,
  ]);
  ws.mergeCells(6, 1, 6, COL_COUNT);
  r6.getCell(1).font = FONT_SUBTITLE;

  // Row 7 — blank
  ws.addRow([]);

  // ── Table header (row 8) ──────────────────────────────────────
  const headerRow = ws.addRow([
    "TANGGAL",
    "",
    "KETERANGAN",
    "",
    "DEBET",
    "KREDIT",
    "SALDO",
  ]);
  ws.mergeCells(headerRow.number, 1, headerRow.number, 2); // TANGGAL spans A-B
  ws.mergeCells(headerRow.number, 3, headerRow.number, 4); // KETERANGAN spans C-D
  styleRow(headerRow, COL_COUNT, {
    font: FONT_HEADER,
    fill: HEADER_FILL,
    alignment: ALIGN_CENTER,
    border: BORDER_THIN,
  });
  headerRow.height = 25;

  // ── Sub-header (row 9): month name + tgl placeholders ─────────
  const subHeaderRow = ws.addRow([namaBulan, "Tgl", "", "", "", "", ""]);
  ws.mergeCells(subHeaderRow.number, 3, subHeaderRow.number, 4);
  styleRow(subHeaderRow, COL_COUNT, {
    font: FONT_HEADER,
    fill: HEADER_FILL,
    alignment: ALIGN_CENTER,
    border: BORDER_THIN,
  });

  // ── Saldo Awal row ─────────────────────────────────────────────
  let runningBalance = saldoAwal;
  if (saldoAwal > 0) {
    const saRow = ws.addRow([
      "",
      "1",
      "Saldo Awal",
      "",
      saldoAwal,
      null,
      runningBalance,
    ]);
    ws.mergeCells(saRow.number, 3, saRow.number, 4);
    styleDataRow(saRow, { bold: true });
  }

  // ── Separate Iuran and Non-Iuran ─────────────────────────────
  const listIuran = [];
  const listNonIuran = [];
  
  transactions.forEach(tx => {
    const isIuran = tx.type === "Iuran" || 
      (tx.debit > 0 && String(tx.description || "").toLowerCase().includes('pembayaran iuran'));
    
    if (isIuran) listIuran.push(tx);
    else listNonIuran.push(tx);
  });

  // ── Non-Iuran Data Rows ─────────────────────────────────────
  listNonIuran.forEach((tx) => {
    const txDate = tx.date ? new Date(tx.date) : null;
    const dayNum = txDate ? txDate.getDate() : "";
    const debit = tx.debit || 0;
    const kredit = tx.kredit || 0;
    runningBalance += debit - kredit;

    const row = ws.addRow([
      "", // Bulan column (empty after first)
      dayNum,
      tx.description || "",
      "",
      debit > 0 ? debit : null,
      kredit > 0 ? kredit : null,
      runningBalance,
    ]);
    ws.mergeCells(row.number, 3, row.number, 4);
    styleDataRow(row, { bold: false });
  });

  // ── Iuran Master & Detail Rows ─────────────────────────────────
  if (listIuran.length > 0) {
    const totalIuran = listIuran.reduce((sum, tx) => sum + (tx.debit || 0), 0);
    runningBalance += totalIuran;

    // Master row (Penerimaan Bulan X)
    const lastDay = new Date(periode.tahun, periode.bulan, 0).getDate();
    const properBulan = namaBulan.charAt(0).toUpperCase() + namaBulan.slice(1).toLowerCase();
    
    const masterRow = ws.addRow([
      "",
      lastDay,
      `Penerimaan Bulan ${properBulan} ${periode.tahun}`,
      "",
      totalIuran,
      null,
      runningBalance,
    ]);
    ws.mergeCells(masterRow.number, 3, masterRow.number, 4);
    styleDataRow(masterRow, { bold: true });

    // Detailed sub-rows
    listIuran.forEach((tx) => {
      const txDate = new Date(tx.date);
      const dd = String(txDate.getDate()).padStart(2, '0');
      const mm = String(txDate.getMonth() + 1).padStart(2, '0');
      const yy = String(txDate.getFullYear()).slice(-2);
      
      const cleanDesc = (tx.description || "").replace(/Pembayaran Iuran Warga\s*/i, "");
      const detailKet = `${dd}/${mm}/${yy} | ${cleanDesc}`;

      const detailRow = ws.addRow([
        "",
        "",
        detailKet, // Column C
        tx.debit,  // Column D (Keterangan Part 2)
        null,      // Column E (Debet) -> Empty to not double count visually
        null,
        null,
      ]);
      
      // Styling specifically for detail rows
      for (let c = 1; c <= COL_COUNT; c++) {
        const cell = detailRow.getCell(c);
        cell.font = FONT_DATA;
        cell.border = BORDER_THIN;
        cell.alignment = c === 4 ? ALIGN_RIGHT : ALIGN_LEFT;
      }
      // Set number format for column D where nominal sits
      detailRow.getCell(4).numFmt = FMT_RUPIAH;
    });
  }

  // ── SUM totals row (bold line) ──────────────────────────────────
  const totalDebet = transactions.reduce((s, tx) => s + (tx.debit || 0), 0) + saldoAwal;
  const totalKredit = transactions.reduce((s, tx) => s + (tx.kredit || 0), 0);

  const sumRow = ws.addRow(["", "", "", "", totalDebet, totalKredit, totalDebet - totalKredit]);
  ws.mergeCells(sumRow.number, 1, sumRow.number, 4);
  styleRow(sumRow, COL_COUNT, {
    font: FONT_TOTAL,
    fill: TOTAL_FILL,
    alignment: ALIGN_RIGHT,
    border: BORDER_MEDIUM_TB,
  });
  sumRow.getCell(5).numFmt = FMT_RUPIAH;
  sumRow.getCell(6).numFmt = FMT_RUPIAH;
  sumRow.getCell(7).numFmt = FMT_RUPIAH;

  // ── blank row ──────────────────────────────────────────────────
  ws.addRow([]);

  // ── Summary section (Saldo Awal / Penerimaan / Pengeluaran / Sisa) ─
  const totalIuranSum = listIuran.reduce((s, tx) => s + (tx.debit || 0), 0);
  const properBulanFooter = namaBulan.charAt(0).toUpperCase() + namaBulan.slice(1).toLowerCase();

  const isPettyCash = type === "petty_cash";
  const strDanaTitle = isPettyCash ? "Petty Cash" : "Kas Tabungan";
  const strTerimaTitle = isPettyCash ? "Iuran Cash" : "Iuran Transfer";
  const strSisaTitle = isPettyCash ? "Sisa dana Petty Cash" : "Saldo Kas Tabungan";

  const summaryItems = [
    { label: "Saldo Awal", value: saldoAwal, tag: "DB" },
    { label: `Penerimaan ${strTerimaTitle} ${properBulanFooter}`, value: totalIuranSum, tag: "DB" },
    { label: `Pengeluaran Bulan ${properBulanFooter}`, value: totalKredit, tag: "CR" },
    { label: `${strSisaTitle} Bulan ${properBulanFooter} ${periode.tahun}`, value: saldoAwal + totalIuranSum - totalKredit, tag: "SALDO" },
  ];

  summaryItems.forEach(({ label, value, tag }) => {
    const row = ws.addRow(["", "", label, "", "", "", value, tag]);
    ws.mergeCells(row.number, 3, row.number, 6);
    row.getCell(3).font = FONT_TOTAL;
    row.getCell(3).alignment = ALIGN_LEFT;
    row.getCell(7).font = FONT_TOTAL;
    row.getCell(7).numFmt = FMT_RUPIAH;
    row.getCell(7).alignment = ALIGN_RIGHT;
    row.getCell(8).font = FONT_DATA;
    row.getCell(8).alignment = ALIGN_LEFT;
  });

  // ── TTD signature block ────────────────────────────────────────
  const ttdConfig = type === "petty_cash"
    ? { jabatan: "Bendahara 2", nama: "Ibu Agus Witarsa" }
    : { jabatan: "Bendahara 1", nama: "Ibu Abdul Harris Suroto" };

  const lastDay = new Date(periode.tahun, periode.bulan, 0).getDate();
  const dateStr = `Malang, ${lastDay} ${properBulanFooter} ${periode.tahun}`;

  const dateRow = ws.addRow([dateStr]);
  ws.mergeCells(dateRow.number, 1, dateRow.number, COL_COUNT);
  dateRow.getCell(1).font = FONT_DATA;

  const dibuatRow = ws.addRow(["Dibuat oleh,"]);
  ws.mergeCells(dibuatRow.number, 1, dibuatRow.number, COL_COUNT);
  dibuatRow.getCell(1).font = FONT_DATA;

  const jabatanRow = ws.addRow([ttdConfig.jabatan]);
  ws.mergeCells(jabatanRow.number, 1, jabatanRow.number, COL_COUNT);
  jabatanRow.getCell(1).font = FONT_DATA;

  ws.addRow([]); // blank for signature space
  ws.addRow([]); // blank for signature space

  const namaRow = ws.addRow([ttdConfig.nama]);
  ws.mergeCells(namaRow.number, 1, namaRow.number, COL_COUNT);
  namaRow.getCell(1).font = { ...FONT_DATA, underline: true };

  // ── Download ───────────────────────────────────────────────────
  const typeLabel = type === "petty_cash" ? "PettyCash" : "Rekening";
  const fileName = `Laporan_${typeLabel}_${namaBulan}${periode.tahun}`;
  await downloadWorkbook(wb, fileName);
}

// ── Internal helper ──────────────────────────────────────────────

function styleDataRow(row, { bold = false } = {}) {
  for (let c = 1; c <= COL_COUNT; c++) {
    const cell = row.getCell(c);
    cell.font = bold ? FONT_TOTAL : FONT_DATA;
    cell.border = BORDER_THIN;
    // Numeric columns E, F, G
    if (c >= 5) {
      cell.numFmt = FMT_RUPIAH;
      cell.alignment = ALIGN_RIGHT;
    } else {
      cell.alignment = ALIGN_LEFT;
    }
  }
}

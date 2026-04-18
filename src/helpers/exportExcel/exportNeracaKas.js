/**
 * Format C — "LAPORAN KAS BENDAHARA" (Neraca Kas RT)
 *
 * Dual-column layout (pemasukan left, pengeluaran right) with
 * totals, saldo summary, and TTD signature block.
 * Runs entirely client-side using ExcelJS.
 *
 * @param {Object} neracaData - { total_income, total_expense, transactions }
 * @param {{bulan: number, tahun: number}} periode
 * @param {Object} ttdConfig  - { bendahara1, bendahara2, ketua_rt, nomor_rt, kota }
 * @param {number} saldoPettyCash - PettyCash balance (default 0)
 * @param {number} saldoRekening  - Rekening balance (default 0)
 */
import ExcelJS from "exceljs";
import {
  BULAN_ID,
  INSTITUSI_LINE3,
  BORDER_THIN,
  HEADER_FILL,
  FONT_TITLE,
  FONT_SUBTITLE,
  FONT_HEADER,
  FONT_DATA,
  FONT_TOTAL,
  ALIGN_CENTER,
  ALIGN_LEFT,
  ALIGN_RIGHT,
  FMT_RUPIAH,
  styleRow,
  downloadWorkbook,
} from "./exportConfig";

const COL_COUNT = 8;
// Column layout: 
// PEMASUKAN: A=Bulan, B=Tgl, C=Keterangan, D=Jumlah
// PENGELUARAN: E=Bulan, F=Tgl, G=Keterangan, H=Jumlah

const DEFAULT_TTD = {
  bendahara1: "Ibu Abdul Harris Suroto",
  bendahara2: "Ibu Agus Witarsa",
  ketua_rt: "Bapak Anton Kurniawan",
  nomor_rt: "RT08",
  kota: "Malang",
};

export async function exportNeracaKas(
  neracaData,
  periode,
  ttdConfig = DEFAULT_TTD,
  saldoPettyCash = 0,
  saldoRekening = 0,
) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Neraca Kas");

  const { total_income = 0, total_expense = 0, transactions = [] } = neracaData;
  const namaBulan = BULAN_ID[periode.bulan - 1];
  const ttd = { ...DEFAULT_TTD, ...ttdConfig };

  const saldoAwal = (saldoPettyCash || 0) + (saldoRekening || 0);

  // ── Column widths ──────────────────────────────────────────────
  ws.columns = [
    { width: 12 }, // A — Bulan Pemasukan
    { width: 6 },  // B — Tgl Pemasukan
    { width: 40 }, // C — Keterangan Pemasukan
    { width: 20 }, // D — Jumlah Pemasukan
    { width: 12 }, // E — Bulan Pengeluaran
    { width: 6 },  // F — Tgl Pengeluaran
    { width: 40 }, // G — Keterangan Pengeluaran
    { width: 20 }, // H — Jumlah Pengeluaran
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

  const r5 = ws.addRow([
    `PERIODE : ${namaBulan.toUpperCase()} ${periode.tahun}`,
  ]);
  ws.mergeCells(5, 1, 5, COL_COUNT);
  r5.getCell(1).font = FONT_SUBTITLE;

  ws.addRow([]); // Row 6 blank

  // ── Table header ──────────────────────────────────────────────
  const headerMain = ws.addRow([
    "PEMASUKAN", "", "", "",
    "PENGELUARAN", "", "", ""
  ]);
  ws.mergeCells(headerMain.number, 1, headerMain.number, 4);
  ws.mergeCells(headerMain.number, 5, headerMain.number, 8);
  styleRow(headerMain, COL_COUNT, {
    font: FONT_HEADER, fill: HEADER_FILL, alignment: ALIGN_CENTER, border: BORDER_THIN,
  });

  const headerSub = ws.addRow([
    "TANGGAL", "TANGGAL", "KETERANGAN", "JUMLAH",
    "TANGGAL", "TANGGAL", "KETERANGAN", "JUMLAH"
  ]);
  styleRow(headerSub, COL_COUNT, {
    font: FONT_HEADER, fill: HEADER_FILL, alignment: ALIGN_CENTER, border: BORDER_THIN,
  });
  
  // ── Split Data ─────────────────────────────────────────────────
  const pemasukanList = [];
  const pengeluaranList = [];
  
  if (saldoAwal > 0) {
    pemasukanList.push({
      tanggal: new Date(periode.tahun, periode.bulan - 1, 1),
      description: "Saldo Awal",
      jumlah: saldoAwal
    });
  }

  transactions.forEach((tx) => {
    if (tx.debit > 0) {
      pemasukanList.push({ ...tx, jumlah: tx.debit });
    } else if (tx.credit > 0) {
      pengeluaranList.push({ ...tx, jumlah: tx.credit });
    }
  });

  const maxRows = Math.max(pemasukanList.length, pengeluaranList.length);

  // ── Output Parallel Columns ────────────────────────────────────
  for (let i = 0; i < maxRows; i++) {
    const inItem = pemasukanList[i];
    const outItem = pengeluaranList[i];

    const inDate = inItem && inItem.tanggal ? new Date(inItem.tanggal) : null;
    const outDate = outItem && outItem.tanggal ? new Date(outItem.tanggal) : null;

    const row = ws.addRow([
      i === 0 && inItem ? namaBulan : "", // A
      inDate ? inDate.getDate() : "",     // B
      inItem ? (inItem.description || inItem.deskripsi) : "", // C
      inItem ? inItem.jumlah : null,      // D
      i === 0 && outItem ? namaBulan : "", // E
      outDate ? outDate.getDate() : "",   // F
      outItem ? (outItem.description || outItem.deskripsi) : "", // G
      outItem ? outItem.jumlah : null     // H
    ]);

    for (let c = 1; c <= COL_COUNT; c++) {
      const cell = row.getCell(c);
      cell.font = FONT_DATA;
      cell.border = BORDER_THIN;
      if (c === 4 || c === 8) {
        cell.numFmt = FMT_RUPIAH;
        cell.alignment = ALIGN_RIGHT;
      } else {
        cell.alignment = c === 1 || c === 5 || c === 2 || c === 6 ? ALIGN_CENTER : ALIGN_LEFT;
      }
    }
  }

  // ── Total rows ─────────────────────────────────────────────────
  const totalIn = pemasukanList.reduce((s, x) => s + (x.jumlah || 0), 0);
  const totalOut = pengeluaranList.reduce((s, x) => s + (x.jumlah || 0), 0);

  const outTotalRow = ws.addRow([
    "", "", "", "",
    "", "", "Total Pengeluaran", totalOut
  ]);
  // Style only the pengeluaran part for this sub-total row
  for (let c = 5; c <= 8; c++) {
    const cell = outTotalRow.getCell(c);
    cell.font = FONT_DATA;
    cell.border = BORDER_THIN;
  }
  outTotalRow.getCell(8).numFmt = FMT_RUPIAH;
  outTotalRow.getCell(8).alignment = ALIGN_RIGHT;
  outTotalRow.getCell(7).alignment = ALIGN_RIGHT;
  outTotalRow.getCell(7).font = FONT_TOTAL;

  const saldoRow = ws.addRow([
    "", "", "", "",
    "", "", "SALDO", totalIn - totalOut
  ]);
  for (let c = 5; c <= 8; c++) {
    const cell = saldoRow.getCell(c);
    cell.font = FONT_DATA;
    cell.border = BORDER_THIN;
  }
  saldoRow.getCell(8).numFmt = FMT_RUPIAH;
  saldoRow.getCell(8).alignment = ALIGN_RIGHT;
  saldoRow.getCell(7).alignment = ALIGN_RIGHT;
  saldoRow.getCell(7).font = FONT_TOTAL;

  // Final Jumlah row
  const sumRow = ws.addRow([
    "JUMLAH", "JUMLAH", "JUMLAH", totalIn,
    "JUMLAH", "JUMLAH", "JUMLAH", totalIn
  ]);
  ws.mergeCells(sumRow.number, 1, sumRow.number, 3);
  ws.mergeCells(sumRow.number, 5, sumRow.number, 7);
  styleRow(sumRow, COL_COUNT, {
    font: FONT_TOTAL, alignment: ALIGN_RIGHT, border: BORDER_THIN,
  });
  sumRow.getCell(4).numFmt = FMT_RUPIAH;
  sumRow.getCell(8).numFmt = FMT_RUPIAH;


  // ── Saldo summary rows ─────────────────────────────────────────
  ws.addRow([]); // blank
  ws.addRow([]); // blank

  const saldoNetBalance = totalIn - totalOut;

  // Saldo Awal is sum of PettyCash and Rekening, wait, manual excel
  // uses "Saldo PettyCash" and "Saldo BCA a.n Titiek Rahmawati".
  // Note: we just display the provided saldoPettyCash and saldoRekening.
  const properBulanFooter = namaBulan.charAt(0).toUpperCase() + namaBulan.slice(1).toLowerCase();

  const summaryRows = [
    [
      `Saldo PettyCash Bulan ${properBulanFooter} ${periode.tahun}`,
      null,
      saldoPettyCash || 0,
      saldoPettyCash || 0
    ],
    [
      `Saldo BCA a.n ${ttd.bendahara1}, Akhir ${properBulanFooter} ${periode.tahun}`,
      null,
      saldoRekening || 0,
      saldoRekening || 0
    ],
    [
      `Total uang iuran per ${new Date(periode.tahun, periode.bulan, 0).getDate()} ${properBulanFooter} ${periode.tahun}`,
      null,
      saldoNetBalance,
      saldoNetBalance
    ],
  ];

  summaryRows.forEach((rowData) => {
    const row = ws.addRow([
      "", "", "", rowData[0], "", rowData[2], rowData[3], ""
    ]);
    ws.mergeCells(row.number, 4, row.number, 5);
    row.getCell(4).font = FONT_DATA;
    row.getCell(6).font = FONT_DATA;
    row.getCell(7).font = FONT_DATA;
    row.getCell(6).numFmt = FMT_RUPIAH;
    row.getCell(7).numFmt = FMT_RUPIAH;
    row.getCell(6).alignment = ALIGN_RIGHT;
    row.getCell(7).alignment = ALIGN_RIGHT;
  });

  // ── TTD signature block ────────────────────────────────────────
  ws.addRow([]); // blank

  const lastDay = new Date(periode.tahun, periode.bulan, 0).getDate();
  const dateStr = `${ttd.kota}, ${lastDay} ${properBulanFooter} ${periode.tahun}`;

  const dateRow = ws.addRow(["", dateStr]);
  ws.mergeCells(dateRow.number, 2, dateRow.number, COL_COUNT);
  dateRow.getCell(2).font = FONT_DATA;

  const dibuatRow = ws.addRow(["", "Dibuat oleh,"]);
  ws.mergeCells(dibuatRow.number, 2, dibuatRow.number, COL_COUNT);
  dibuatRow.getCell(2).font = FONT_DATA;

  ws.addRow([]); // blank
  ws.addRow([]); // blank

  const nameRow = ws.addRow([
    "", ttd.bendahara1, "", "", "", "", ttd.bendahara2
  ]);
  nameRow.getCell(2).font = { ...FONT_DATA, underline: true };
  nameRow.getCell(7).font = { ...FONT_DATA, underline: true };
  ws.mergeCells(nameRow.number, 2, nameRow.number, 4);
  ws.mergeCells(nameRow.number, 7, nameRow.number, 8);

  const titleRow = ws.addRow([
    "", "Bendahara 1", "", "", "", "", "Bendahara 2"
  ]);
  titleRow.getCell(2).font = FONT_DATA;
  titleRow.getCell(7).font = FONT_DATA;
  ws.mergeCells(titleRow.number, 2, titleRow.number, 4);
  ws.mergeCells(titleRow.number, 7, titleRow.number, 8);


  // ── Download ───────────────────────────────────────────────────
  const fileName = `Neraca_Kas_RT_${namaBulan}${periode.tahun}`;
  await downloadWorkbook(wb, fileName);
}

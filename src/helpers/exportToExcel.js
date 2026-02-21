import * as XLSX from "xlsx";

/**
 * Helper to export an array of typed objects to an Excel file (.xlsx).
 *
 * @param {Array} data - The array of objects to export
 * @param {string} fileName - The desired name of the file (without extension)
 */
export const exportToExcel = (data, fileName) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Create an Excel file and trigger download
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

import * as XLSX from "xlsx";

/**
 * Helper to export an array of typed objects to an Excel file (.xlsx).
 *
 * @param {Array} data - The array of objects to export
 * @param {string} fileName - The desired name of the file (without extension)
 */
export const exportToExcel = (data, fileName, options = {}) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  let worksheet;
  // If custom headers or prefixes are provided
  if (options.prefixRows) {
    worksheet = XLSX.utils.aoa_to_sheet(options.prefixRows);
    // Append the JSON table at the bottom of the existing worksheet
    XLSX.utils.sheet_add_json(worksheet, data, { origin: -1 });
  } else {
    // Convert JSON to worksheet normally
    worksheet = XLSX.utils.json_to_sheet(data);
  }

  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Create an Excel file and trigger download
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

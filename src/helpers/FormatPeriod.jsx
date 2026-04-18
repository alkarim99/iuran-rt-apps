/**
 * Formats a period string given a start Date and end Date.
 * @param {string|Date} startDateInput
 * @param {string|Date} endDateInput
 * @param {boolean} isShortMonth - Whether to use short month names (e.g., "Jan") or long (e.g., "Januari").
 * @returns {string} Formatted period string.
 */
const FormatPeriod = (startDateInput, endDateInput, isShortMonth = false) => {
  if (!startDateInput || !endDateInput) return "";

  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  // Default month formatting based on system locale (typically Indonesian configured or generic fallback)
  // For precise control in Indonesian text, we map it directly:
  const monthNamesLong = [
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

  const monthNamesShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agt",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const months = isShortMonth ? monthNamesShort : monthNamesLong;

  const startMonth = months[startDate.getMonth()];
  const startYear = startDate.getFullYear();

  const endMonth = months[endDate.getMonth()];
  const endYear = endDate.getFullYear();

  // Same Year and Same Month: "Januari 2026"
  if (startYear === endYear && startDate.getMonth() === endDate.getMonth()) {
    return `${startMonth} ${startYear}`;
  }

  // Same Year but Different Month: "Januari - Februari 2026"
  if (startYear === endYear && startDate.getMonth() !== endDate.getMonth()) {
    return `${startMonth} - ${endMonth} ${endYear}`;
  }

  // Different Year: "Desember 2025 - Februari 2026"
  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
};

export default FormatPeriod;

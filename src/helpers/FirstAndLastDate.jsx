const getFirstAndLastDateOfMonth = (year, month) => {
  // JavaScript months are 0-based, so we need to subtract 1 from the month
  var firstDay = new Date(year, month - 1, 1)
  var lastDay = new Date(year, month, 0) // Setting day to 0 gets the last day of the previous month

  // Formatting the dates to display as YYYY-MM-DD
  var firstDateOfMonth =
    firstDay.getFullYear() +
    "-" +
    (firstDay.getMonth() + 1) +
    "-" +
    firstDay.getDate()
  var lastDateOfMonth =
    lastDay.getFullYear() +
    "-" +
    (lastDay.getMonth() + 1) +
    "-" +
    lastDay.getDate()

  return {
    firstDate: firstDateOfMonth,
    lastDate: lastDateOfMonth,
  }
}

export default getFirstAndLastDateOfMonth

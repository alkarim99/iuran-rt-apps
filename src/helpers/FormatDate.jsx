const FormatDate = (inputDate) => {
  // Parse the input date string
  const date = new Date(inputDate)

  // Get day, month, and year
  const day = date.getDate()
  const month = date.toLocaleString("default", { month: "long" }) // Get month name
  const year = date.getFullYear()

  // Construct the formatted date string
  const formattedDate = `${day} ${month} ${year}`

  return formattedDate
}

export default FormatDate

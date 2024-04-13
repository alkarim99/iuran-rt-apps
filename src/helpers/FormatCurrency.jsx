const FormatCurrency = (amount) => {
  // Convert the amount to string
  let formattedAmount = amount.toString()

  // Insert dots for thousands separator
  formattedAmount = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  // Prepend "Rp " to the formatted amount
  return "Rp " + formattedAmount
}

export default FormatCurrency
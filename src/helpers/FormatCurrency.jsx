const FormatCurrency = (amount) => {
  if (amount == null) return "Rp 0";
  // Convert the amount to string
  let [whole, fraction] = amount.toString().split(".");

  // Insert dots for thousands separator
  whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Prepend "Rp " to the formatted amount, handle fractions if any
  return fraction ? `Rp ${whole},${fraction}` : `Rp ${whole}`;
};

export default FormatCurrency;

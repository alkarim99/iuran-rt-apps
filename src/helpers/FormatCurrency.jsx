export const toMoney = (value) => Math.round(value * 100) / 100;

const FormatCurrency = (amount) => {
  if (amount == null) return "Rp 0";
  const clean = toMoney(amount);
  // Convert the amount to string
  let [whole, fraction] = clean.toString().split(".");

  // Insert dots for thousands separator
  whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Prepend "Rp " to the formatted amount, handle fractions if any
  return fraction ? `Rp ${whole},${fraction.padEnd(2, "0")}` : `Rp ${whole},00`;
};

export default FormatCurrency;

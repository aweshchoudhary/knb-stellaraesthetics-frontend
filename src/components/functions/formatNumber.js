function formatNumber(number, config) {
  const formatedNumber = new Intl.NumberFormat(config?.country || "en-IN", {
    style: config?.style || "currency",
    currency: config?.type || "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
  return formatedNumber;
}

export default formatNumber;

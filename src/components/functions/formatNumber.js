function formatNumber(number, config) {
  const formatedNumber = new Intl.NumberFormat(config?.country || "en-IN", {
    style: config?.style || "currency",
    currency: config?.type || "INR",
  }).format(number);
  return formatedNumber;
}

export default formatNumber;

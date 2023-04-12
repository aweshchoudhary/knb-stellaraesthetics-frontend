function formatNumber(number, config) {
  const formatedNumber = new Intl.NumberFormat(config.country, {
    style: config.style || "currency",
    currency: config.type,
  }).format(number);
  return formatedNumber;
}

export default formatNumber;

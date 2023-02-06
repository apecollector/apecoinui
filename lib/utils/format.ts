export const formatToUSD = (amount: number) =>
  Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "USD",
    notation: "compact",
    compactDisplay: "short",
  }).format(amount);

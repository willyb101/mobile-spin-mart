export const CURRENCY_SYMBOL = "K";

export function formatPrice(n: number): string {
  return `${CURRENCY_SYMBOL}${n.toLocaleString("en-ZM")}`;
}

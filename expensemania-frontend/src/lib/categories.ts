export const CATEGORIES = [
  { id: "food",     label: "Food",     emoji: "🍜", hue: 12 },
  { id: "transport", label: "Transport", emoji: "🚕", hue: 200 },
  { id: "shopping", label: "Shopping", emoji: "🛍️", hue: 320 },
  { id: "bills",    label: "Bills",    emoji: "🧾", hue: 45 },
  { id: "fun",      label: "Fun",      emoji: "🎉", hue: 280 },
  { id: "health",   label: "Health",   emoji: "💊", hue: 145 },
  { id: "travel",   label: "Travel",   emoji: "✈️", hue: 175 },
  { id: "other",    label: "Other",    emoji: "✨", hue: 240 },
] as const;

export type CategoryId = typeof CATEGORIES[number]["id"];

export function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

export function formatCurrency(n: number, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
  } catch {
    return `₹${n.toFixed(2)}`;
  }
}

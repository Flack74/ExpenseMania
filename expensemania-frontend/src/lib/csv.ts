import type { Expense } from "./types";
import { getCategory } from "./categories";

function esc(v: unknown) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function exportExpensesCsv(expenses: Expense[], filename = "expenses.csv") {
  const headers = ["Date", "Time", "Category", "Note", "Amount (INR)"];
  const rows = expenses
    .slice()
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map((e) => {
      const d = new Date(e.date);
      return [
        d.toISOString().slice(0, 10),
        d.toTimeString().slice(0, 5),
        getCategory(e.category).label,
        e.note || "",
        e.amount.toFixed(2),
      ].map(esc).join(",");
    });
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

import type { Expense } from "@/lib/types";
import { getCategory, formatCurrency } from "@/lib/categories";
import { Pencil, Trash2 } from "lucide-react";

export function ExpenseRow({
  expense,
  onDelete,
  onEdit,
  currency = "INR",
}: {
  expense: Expense;
  onDelete: (id: string) => void;
  onEdit: (e: Expense) => void;
  currency?: string;
}) {
  const cat = getCategory(expense.category);
  const time = new Date(expense.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="group flex items-start gap-3 rounded-2xl border border-border/50 bg-card/40 p-3 transition-all hover:border-primary/40 hover:bg-card/70">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg sm:h-11 sm:w-11 sm:text-xl"
        style={{
          background: `hsl(${cat.hue} 80% 60% / 0.15)`,
          boxShadow: `0 0 24px hsl(${cat.hue} 90% 60% / 0.18)`,
        }}
      >
        {cat.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <p className="truncate font-medium">{expense.note || cat.label}</p>
          <p className="break-words font-display text-sm font-semibold tabular-nums sm:text-base">{formatCurrency(expense.amount, currency)}</p>
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{cat.label}</span>
          <span>{time}</span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1 opacity-100 sm:flex-row sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
        <button
          aria-label="Edit"
          onClick={() => onEdit(expense)}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/15 hover:text-primary sm:p-2"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          aria-label="Delete"
          onClick={() => onDelete(expense.id)}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive sm:p-2"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

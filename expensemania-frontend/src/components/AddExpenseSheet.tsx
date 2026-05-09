import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { api } from "@/lib/api";
import type { Expense } from "@/lib/types";
import { toast } from "sonner";
import { Plus, X, Save } from "lucide-react";

export function AddExpenseSheet({
  open,
  onClose,
  onSaved,
  expense,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  expense?: Expense | null;
}) {
  const isEdit = !!expense;
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("food");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (expense) {
      setAmount(String(expense.amount));
      setCategory(expense.category);
      setNote(expense.note || "");
      setDate(new Date(expense.date).toISOString().slice(0, 10));
    } else {
      setAmount("");
      setCategory("food");
      setNote("");
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [open, expense]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = parseFloat(amount);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setBusy(true);
    try {
      const isoDate = new Date(date + "T" + new Date().toTimeString().slice(0, 8)).toISOString();
      if (isEdit && expense) {
        await api.updateExpense(expense.id, { amount: n, category, note: note.trim(), date: isoDate });
        toast.success("Expense updated");
      } else {
        await api.createExpense({ amount: n, category, note: note.trim(), date: isoDate });
        toast.success("Expense added");
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-0 sm:items-center sm:px-4" role="dialog" aria-modal="true">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-md animate-fade-up"
      />
      <div className="relative z-10 max-h-[calc(100svh-1rem)] w-full max-w-lg animate-fade-up overflow-y-auto rounded-t-3xl glass-card p-4 sm:mx-0 sm:max-h-[min(92svh,44rem)] sm:rounded-3xl sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold sm:text-2xl">{isEdit ? "Edit expense" : "New expense"}</h2>
            <p className="text-sm text-muted-foreground">
              {isEdit ? "Update the details below" : "Log it before you forget"}
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted/60" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="text-center">
            <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Amount</div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-display text-3xl text-muted-foreground">₹</span>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                required
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-[min(11rem,60vw)] bg-transparent text-center font-display text-4xl font-bold text-gradient outline-none placeholder:text-muted-foreground/40 sm:text-5xl"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Category</label>
            <div className="grid grid-cols-2 gap-2 min-[420px]:grid-cols-4">
              {CATEGORIES.map((c) => {
                const active = category === c.id;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`flex min-h-[5.25rem] flex-col items-center justify-center gap-1 rounded-2xl border p-2 text-xs transition-all sm:p-3 ${
                      active
                        ? "border-primary/60 bg-primary/15 shadow-glow-primary"
                        : "border-border bg-muted/30 hover:bg-muted/60"
                    }`}
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <span className={active ? "font-semibold text-foreground" : "text-muted-foreground"}>
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-primary/60"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Note</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={120}
                placeholder="Coffee with Alex"
                className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-primary/60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-primary py-3.5 font-semibold text-primary-foreground transition-all hover:scale-[1.01] hover:shadow-glow-primary disabled:opacity-60"
          >
            {isEdit ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {busy ? "Saving…" : isEdit ? "Save changes" : "Add expense"}
          </button>
        </form>
      </div>
    </div>
  );
}

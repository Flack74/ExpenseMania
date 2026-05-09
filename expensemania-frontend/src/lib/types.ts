export type User = {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatar?: string;
  currencyPreference?: string;
  timezone?: string;
  themePreference?: "light" | "dark" | "system";
  createdAt?: string;
  updatedAt?: string;
};
export type Expense = {
  id: string;
  userId?: string;
  amount: number;
  category: string;
  subcategory?: string;
  note: string;
  date: string; // ISO
  currency?: string;
  exchangeRate?: number;
  tags?: string[];
  paymentMethod?: string;
  merchant?: string;
  isRecurring?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Budget = {
  id: string;
  userId?: string;
  /** Category id from CATEGORIES, or "__total__" for an overall monthly cap. */
  category: string;
  /** Cap amount in INR for one month. */
  amount: number;
  /** Period (only "monthly" supported for now). */
  period: "monthly";
  /** If true, applies to every month from startMonth (until endMonth if set). */
  recurring: boolean;
  /** "YYYY-MM" — first month this budget applies to. */
  startMonth: string;
  /** Optional "YYYY-MM" — last month this budget applies to. */
  endMonth?: string | null;
  /** Optional notify threshold (0..1). Default 0.8. */
  alertThreshold?: number;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
};

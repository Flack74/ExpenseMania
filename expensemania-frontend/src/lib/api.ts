import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import type { Budget, Expense, User } from "@/lib/types";

type AuthResponse = {
  user: User;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: string;
};

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");
const API_PREFIX = "/api/v1";

const client = axios.create({
  baseURL: `${API_ORIGIN}${API_PREFIX}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<AuthResponse> | null = null;

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;
    const url = config?.url || "";
    const isAuthWrite = /\/auth\/(login|register|forgot-password|reset-password|logout|refresh)$/.test(url);
    if (status !== 401 || !config || config._retry || isAuthWrite) {
      return Promise.reject(toApiError(error));
    }
    config._retry = true;
    refreshPromise ??= client.post<AuthResponse>("/auth/refresh", {}).then((res) => res.data);
    try {
      await refreshPromise;
      return client(config);
    } finally {
      refreshPromise = null;
    }
  },
);

function toApiError(error: AxiosError) {
  const data = error.response?.data;
  if (data && typeof data === "object" && "error" in data) {
    return new Error(String((data as { error: unknown }).error));
  }
  if (error.message) return new Error(error.message);
  return new Error("Request failed");
}

export const api = {
  async register(payload: { email: string; password: string; name?: string }) {
    const { data } = await client.post<AuthResponse>("/auth/register", {
      email: payload.email,
      password: payload.password,
      name: payload.name,
      username: payload.name,
    });
    return data;
  },

  async signup(email: string, password: string, name?: string) {
    return api.register({ email, password, name });
  },

  async login(email: string, password: string) {
    const { data } = await client.post<AuthResponse>("/auth/login", { email, password });
    return data;
  },

  async logout() {
    try {
      await client.post("/auth/logout", {});
    } catch {
      return;
    }
  },

  async me() {
    const { data } = await client.get<{ user: User }>("/auth/me");
    return data.user;
  },

  async forgotPassword(email: string) {
    const { data } = await client.post<{ message: string }>("/auth/forgot-password", { email });
    return data;
  },

  async resetPassword(token: string, newPassword: string) {
    const { data } = await client.post<{ message: string }>("/auth/reset-password", { token, newPassword });
    return data;
  },

  async updateProfile(payload: Partial<Pick<User, "name" | "username" | "avatar" | "currencyPreference" | "timezone" | "themePreference">>) {
    const { data } = await client.patch<{ user: User }>("/user/profile", payload);
    return data.user;
  },

  async listExpenses(): Promise<Expense[]> {
    const { data } = await client.get<{ expenses: Expense[] }>("/expenses");
    return data.expenses ?? [];
  },

  async createExpense(payload: {
    amount: number;
    category: string;
    note?: string;
    date?: string;
    isRecurring?: boolean;
  }): Promise<Expense> {
    const { data } = await client.post<{ expense: Expense }>("/expenses", payload);
    return data.expense;
  },

  async updateExpense(id: string, payload: Partial<Expense>): Promise<Expense> {
    const { data } = await client.put<{ expense: Expense }>(`/expenses/${encodeURIComponent(id)}`, payload);
    return data.expense;
  },

  async deleteExpense(id: string) {
    const { data } = await client.delete<{ deleted: number }>(`/expenses/${encodeURIComponent(id)}`);
    return data.deleted;
  },

  async listBudgets(): Promise<Budget[]> {
    const { data } = await client.get<{ budgets: Budget[] }>("/budgets");
    return data.budgets ?? [];
  },

  async createBudget(payload: Omit<Budget, "id" | "userId" | "createdAt">): Promise<Budget> {
    const { data } = await client.post<{ budget: Budget }>("/budgets", payload);
    return data.budget;
  },

  async updateBudget(id: string, payload: Partial<Budget>): Promise<Budget> {
    const { data } = await client.put<{ budget: Budget }>(`/budgets/${encodeURIComponent(id)}`, payload);
    return data.budget;
  },

  async deleteBudget(id: string): Promise<number> {
    const { data } = await client.delete<{ deleted: number }>(`/budgets/${encodeURIComponent(id)}`);
    return data.deleted;
  },
};

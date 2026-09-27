import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  Transaction, Goal, GoalContribution, Budget, Account,
  Category, Notification, RecurringTransaction, Asset, Liability
} from "../types"
import {
  SEED_TRANSACTIONS, SEED_GOALS, SEED_BUDGETS, SEED_ACCOUNTS,
  SEED_CATEGORIES, SEED_RECURRING, SEED_NOTIFICATIONS, SEED_ASSETS, SEED_LIABILITIES
} from "../constants/data"

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function now(): string {
  return new Date().toISOString()
}

interface FinanceState {
  transactions: Transaction[]
  goals: Goal[]
  contributions: GoalContribution[]
  budgets: Budget[]
  accounts: Account[]
  categories: Category[]
  notifications: Notification[]
  recurring: RecurringTransaction[]
  assets: Asset[]
  liabilities: Liability[]
  initialized: boolean

  initSeedData: () => void

  // Transactions
  addTransaction: (data: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => string
  updateTransaction: (id: string, data: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void

  // Goals
  addGoal: (data: Omit<Goal, "id" | "createdAt" | "updatedAt">) => string
  updateGoal: (id: string, data: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  addContribution: (data: Omit<GoalContribution, "id" | "createdAt">) => void

  // Budgets
  addBudget: (data: Omit<Budget, "id" | "createdAt" | "updatedAt">) => string
  updateBudget: (id: string, data: Partial<Budget>) => void
  deleteBudget: (id: string) => void

  // Accounts
  addAccount: (data: Omit<Account, "id" | "createdAt" | "updatedAt">) => string
  updateAccount: (id: string, data: Partial<Account>) => void
  deleteAccount: (id: string) => void

  // Categories
  addCategory: (data: Omit<Category, "id" | "createdAt">) => string
  updateCategory: (id: string, data: Partial<Category>) => void
  deleteCategory: (id: string) => void

  // Recurring
  addRecurring: (data: Omit<RecurringTransaction, "id" | "createdAt">) => string
  updateRecurring: (id: string, data: Partial<RecurringTransaction>) => void
  deleteRecurring: (id: string) => void

  // Notifications
  markNotificationRead: (id: string) => void
  markAllRead: () => void
  deleteNotification: (id: string) => void
  addNotification: (data: Omit<Notification, "id" | "createdAt">) => void

  // Assets & Liabilities
  addAsset: (data: Omit<Asset, "id" | "createdAt" | "updatedAt">) => string
  updateAsset: (id: string, data: Partial<Asset>) => void
  deleteAsset: (id: string) => void
  addLiability: (data: Omit<Liability, "id" | "createdAt" | "updatedAt">) => string
  updateLiability: (id: string, data: Partial<Liability>) => void
  deleteLiability: (id: string) => void
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      goals: [],
      contributions: [],
      budgets: [],
      accounts: [],
      categories: [],
      notifications: [],
      recurring: [],
      assets: [],
      liabilities: [],
      initialized: false,

      initSeedData: () => {
        if (get().initialized) return
        set({
          transactions: SEED_TRANSACTIONS,
          goals: SEED_GOALS,
          contributions: [],
          budgets: SEED_BUDGETS,
          accounts: SEED_ACCOUNTS,
          categories: SEED_CATEGORIES,
          notifications: SEED_NOTIFICATIONS,
          recurring: SEED_RECURRING,
          assets: SEED_ASSETS,
          liabilities: SEED_LIABILITIES,
          initialized: true,
        })
      },

      // Transactions
      addTransaction: (data) => {
        const id = genId("tx")
        set((s) => ({
          transactions: [{ ...data, id, createdAt: now(), updatedAt: now() }, ...s.transactions],
        }))
        return id
      },
      updateTransaction: (id, data) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...data, updatedAt: now() } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

      // Goals
      addGoal: (data) => {
        const id = genId("goal")
        set((s) => ({
          goals: [{ ...data, id, createdAt: now(), updatedAt: now() }, ...s.goals],
        }))
        return id
      },
      updateGoal: (id, data) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...data, updatedAt: now() } : g)),
        })),
      deleteGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      addContribution: (data) => {
        const id = genId("contrib")
        set((s) => {
          const newContrib = { ...data, id, createdAt: now() }
          const goals = s.goals.map((g) =>
            g.id === data.goalId
              ? { ...g, savedAmount: g.savedAmount + data.amount, updatedAt: now() }
              : g
          )
          return { contributions: [newContrib, ...s.contributions], goals }
        })
      },

      // Budgets
      addBudget: (data) => {
        const id = genId("bud")
        set((s) => ({
          budgets: [{ ...data, id, createdAt: now(), updatedAt: now() }, ...s.budgets],
        }))
        return id
      },
      updateBudget: (id, data) =>
        set((s) => ({
          budgets: s.budgets.map((b) => (b.id === id ? { ...b, ...data, updatedAt: now() } : b)),
        })),
      deleteBudget: (id) => set((s) => ({ budgets: s.budgets.filter((b) => b.id !== id) })),

      // Accounts
      addAccount: (data) => {
        const id = genId("acc")
        set((s) => ({
          accounts: [{ ...data, id, createdAt: now(), updatedAt: now() }, ...s.accounts],
        }))
        return id
      },
      updateAccount: (id, data) =>
        set((s) => ({
          accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...data, updatedAt: now() } : a)),
        })),
      deleteAccount: (id) => set((s) => ({ accounts: s.accounts.filter((a) => a.id !== id) })),

      // Categories
      addCategory: (data) => {
        const id = genId("cat")
        set((s) => ({
          categories: [...s.categories, { ...data, id, createdAt: now() }],
        }))
        return id
      },
      updateCategory: (id, data) =>
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      deleteCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

      // Recurring
      addRecurring: (data) => {
        const id = genId("rec")
        set((s) => ({
          recurring: [{ ...data, id, createdAt: now() }, ...s.recurring],
        }))
        return id
      },
      updateRecurring: (id, data) =>
        set((s) => ({
          recurring: s.recurring.map((r) => (r.id === id ? { ...r, ...data } : r)),
        })),
      deleteRecurring: (id) => set((s) => ({ recurring: s.recurring.filter((r) => r.id !== id) })),

      // Notifications
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),
      markAllRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
        })),
      deleteNotification: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
      addNotification: (data) => {
        const id = genId("notif")
        set((s) => ({
          notifications: [{ ...data, id, createdAt: now() }, ...s.notifications],
        }))
      },

      // Assets
      addAsset: (data) => {
        const id = genId("asset")
        set((s) => ({
          assets: [{ ...data, id, createdAt: now(), updatedAt: now() }, ...s.assets],
        }))
        return id
      },
      updateAsset: (id, data) =>
        set((s) => ({
          assets: s.assets.map((a) => (a.id === id ? { ...a, ...data, updatedAt: now() } : a)),
        })),
      deleteAsset: (id) => set((s) => ({ assets: s.assets.filter((a) => a.id !== id) })),

      addLiability: (data) => {
        const id = genId("liab")
        set((s) => ({
          liabilities: [{ ...data, id, createdAt: now(), updatedAt: now() }, ...s.liabilities],
        }))
        return id
      },
      updateLiability: (id, data) =>
        set((s) => ({
          liabilities: s.liabilities.map((l) =>
            l.id === id ? { ...l, ...data, updatedAt: now() } : l
          ),
        })),
      deleteLiability: (id) =>
        set((s) => ({ liabilities: s.liabilities.filter((l) => l.id !== id) })),
    }),
    { name: "finance-data" }
  )
)

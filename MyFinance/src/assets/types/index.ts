export interface User {
  id: string
  email: string
  fullName: string
  currency: string
  country: string
  timezone: string
  avatarUrl?: string
  monthlyIncome?: number
  phone?: string
  createdAt: string
}

export interface Account {
  id: string
  userId: string
  name: string
  type: "cash" | "bank" | "savings" | "credit_card" | "wallet" | "investment" | "other"
  bankName?: string
  maskedNumber?: string
  openingBalance: number
  currentBalance: number
  currency: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  userId: string
  name: string
  type: "income" | "expense" | "both"
  icon: string
  color: string
  isDefault: boolean
  createdAt: string
}

export interface Transaction {
  id: string
  userId: string
  accountId: string
  categoryId: string
  type: "income" | "expense" | "transfer"
  amount: number
  description: string
  notes?: string
  transactionDate: string
  paymentMethod?: string
  reference?: string
  isRecurring: boolean
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Goal {
  id: string
  userId: string
  name: string
  description?: string
  targetAmount: number
  savedAmount: number
  targetDate: string
  category: string
  icon: string
  color: string
  priority: "low" | "medium" | "high"
  status: "active" | "completed" | "paused" | "archived"
  createdAt: string
  updatedAt: string
}

export interface GoalContribution {
  id: string
  goalId: string
  userId: string
  amount: number
  contributionDate: string
  note?: string
  createdAt: string
}

export interface Budget {
  id: string
  userId: string
  categoryId: string
  amount: number
  month: number
  year: number
  warningThreshold: number
  createdAt: string
  updatedAt: string
}

export interface RecurringTransaction {
  id: string
  userId: string
  accountId: string
  categoryId: string
  name: string
  amount: number
  type: "income" | "expense"
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
  startDate: string
  endDate?: string
  nextDueDate: string
  active: boolean
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type:
    | "budget_exceeded"
    | "budget_warning"
    | "upcoming_bill"
    | "goal_deadline"
    | "goal_completed"
    | "recurring_due"
    | "large_expense"
    | "monthly_summary"
    | "info"
  isRead: boolean
  createdAt: string
}

export interface Asset {
  id: string
  userId: string
  name: string
  type: "cash" | "bank" | "savings" | "investment" | "property" | "other"
  value: number
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Liability {
  id: string
  userId: string
  name: string
  type: "credit_card" | "loan" | "emi" | "debt" | "other"
  amount: number
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info" | "warning"
}

export type Currency = {
  code: string
  symbol: string
  name: string
  locale: string
}

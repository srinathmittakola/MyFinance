import { subDays, subMonths, format } from "date-fns"
import type { Account, Category, Transaction, Goal, Budget, Notification, RecurringTransaction, Asset, Liability } from "../types"

const USER_ID = "demo-user-1"

export const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", locale: "ar-AE" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", locale: "en-CA" },
]

export const NAVIGATION_ITEMS = [
  { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
  { id: "transactions", label: "Transactions", path: "/transactions", icon: "ArrowLeftRight" },
  { id: "income", label: "Income", path: "/income", icon: "TrendingUp" },
  { id: "expenses", label: "Expenses", path: "/expenses", icon: "TrendingDown" },
  { id: "goals", label: "Goals", path: "/goals", icon: "Target" },
  { id: "budgets", label: "Budgets", path: "/budgets", icon: "PieChart" },
  { id: "accounts", label: "Accounts", path: "/accounts", icon: "CreditCard" },
  { id: "recurring", label: "Recurring", path: "/recurring", icon: "RefreshCw" },
  { id: "reports", label: "Reports", path: "/reports", icon: "BarChart3" },
]

export const SECONDARY_NAV = [
  { id: "calendar", label: "Calendar", path: "/calendar", icon: "Calendar" },
  { id: "categories", label: "Categories", path: "/categories", icon: "Tag" },
  { id: "notifications", label: "Notifications", path: "/notifications", icon: "Bell" },
  { id: "settings", label: "Settings", path: "/settings", icon: "Settings" },
  { id: "profile", label: "Profile", path: "/profile", icon: "User" },
]

export const ACCOUNT_TYPES = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank Account" },
  { value: "savings", label: "Savings Account" },
  { value: "credit_card", label: "Credit Card" },
  { value: "wallet", label: "Digital Wallet" },
  { value: "investment", label: "Investment" },
  { value: "other", label: "Other" },
]

export const PAYMENT_METHODS = [
  "Cash", "UPI", "Net Banking", "Credit Card", "Debit Card", "NEFT/RTGS", "Cheque", "Other"
]

export const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
]

function d(daysAgo: number): string {
  return format(subDays(new Date(), daysAgo), "yyyy-MM-dd")
}

function m(monthsAgo: number, day: number): string {
  return format(subMonths(new Date(), monthsAgo), `yyyy-MM-${String(day).padStart(2, "0")}`)
}

export const SEED_CATEGORIES: Category[] = [
  { id: "cat-salary", userId: USER_ID, name: "Salary", type: "income", icon: "Briefcase", color: "#16A34A", isDefault: true, createdAt: d(60) },
  { id: "cat-freelance", userId: USER_ID, name: "Freelance", type: "income", icon: "Laptop", color: "#0891B2", isDefault: true, createdAt: d(60) },
  { id: "cat-investment", userId: USER_ID, name: "Investment Returns", type: "income", icon: "TrendingUp", color: "#7C3AED", isDefault: true, createdAt: d(60) },
  { id: "cat-other-income", userId: USER_ID, name: "Other Income", type: "income", icon: "Plus", color: "#64748B", isDefault: true, createdAt: d(60) },
  { id: "cat-food", userId: USER_ID, name: "Food & Dining", type: "expense", icon: "UtensilsCrossed", color: "#F59E0B", isDefault: true, createdAt: d(60) },
  { id: "cat-shopping", userId: USER_ID, name: "Shopping", type: "expense", icon: "ShoppingBag", color: "#EC4899", isDefault: true, createdAt: d(60) },
  { id: "cat-transport", userId: USER_ID, name: "Transport", type: "expense", icon: "Car", color: "#0891B2", isDefault: true, createdAt: d(60) },
  { id: "cat-rent", userId: USER_ID, name: "Rent", type: "expense", icon: "Home", color: "#DC2626", isDefault: true, createdAt: d(60) },
  { id: "cat-bills", userId: USER_ID, name: "Bills & Utilities", type: "expense", icon: "Zap", color: "#D97706", isDefault: true, createdAt: d(60) },
  { id: "cat-entertainment", userId: USER_ID, name: "Entertainment", type: "expense", icon: "Tv", color: "#7C3AED", isDefault: true, createdAt: d(60) },
  { id: "cat-healthcare", userId: USER_ID, name: "Healthcare", type: "expense", icon: "Heart", color: "#EF4444", isDefault: true, createdAt: d(60) },
  { id: "cat-education", userId: USER_ID, name: "Education", type: "expense", icon: "GraduationCap", color: "#2563EB", isDefault: true, createdAt: d(60) },
  { id: "cat-subscriptions", userId: USER_ID, name: "Subscriptions", type: "expense", icon: "RefreshCw", color: "#6366F1", isDefault: true, createdAt: d(60) },
  { id: "cat-insurance", userId: USER_ID, name: "Insurance", type: "expense", icon: "Shield", color: "#0F766E", isDefault: true, createdAt: d(60) },
  { id: "cat-travel", userId: USER_ID, name: "Travel", type: "expense", icon: "Plane", color: "#8B5CF6", isDefault: true, createdAt: d(60) },
  { id: "cat-other-exp", userId: USER_ID, name: "Other Expenses", type: "expense", icon: "MoreHorizontal", color: "#64748B", isDefault: true, createdAt: d(60) },
]

export const SEED_ACCOUNTS: Account[] = [
  {
    id: "acc-sbi",
    userId: USER_ID,
    name: "SBI Savings",
    type: "bank",
    bankName: "State Bank of India",
    maskedNumber: "xxxx 4821",
    openingBalance: 500000,
    currentBalance: 642500,
    currency: "INR",
    description: "Primary savings account",
    createdAt: d(90),
    updatedAt: d(1),
  },
  {
    id: "acc-hdfc",
    userId: USER_ID,
    name: "HDFC Salary",
    type: "bank",
    bankName: "HDFC Bank",
    maskedNumber: "xxxx 7792",
    openingBalance: 100000,
    currentBalance: 185000,
    currency: "INR",
    description: "Salary account",
    createdAt: d(90),
    updatedAt: d(1),
  },
  {
    id: "acc-cash",
    userId: USER_ID,
    name: "Cash",
    type: "cash",
    openingBalance: 15000,
    currentBalance: 25000,
    currency: "INR",
    createdAt: d(90),
    updatedAt: d(1),
  },
  {
    id: "acc-cc",
    userId: USER_ID,
    name: "ICICI Credit Card",
    type: "credit_card",
    bankName: "ICICI Bank",
    maskedNumber: "xxxx 5501",
    openingBalance: 0,
    currentBalance: -28500,
    currency: "INR",
    description: "Reward credit card",
    createdAt: d(90),
    updatedAt: d(1),
  },
]

export const SEED_TRANSACTIONS: Transaction[] = [
  // This month - income
  { id: "tx-1", userId: USER_ID, accountId: "acc-hdfc", categoryId: "cat-salary", type: "income", amount: 85000, description: "Monthly Salary", transactionDate: d(5), isRecurring: true, createdAt: d(5), updatedAt: d(5) },
  { id: "tx-2", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-freelance", type: "income", amount: 25000, description: "Freelance Project - UI Design", transactionDate: d(8), isRecurring: false, createdAt: d(8), updatedAt: d(8) },
  { id: "tx-3", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-investment", type: "income", amount: 8500, description: "Mutual Fund Dividends", transactionDate: d(10), isRecurring: false, createdAt: d(10), updatedAt: d(10) },
  // This month - expenses
  { id: "tx-4", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-rent", type: "expense", amount: 18000, description: "Monthly Rent", transactionDate: d(3), isRecurring: true, createdAt: d(3), updatedAt: d(3) },
  { id: "tx-5", userId: USER_ID, accountId: "acc-hdfc", categoryId: "cat-food", type: "expense", amount: 3500, description: "Swiggy - Food delivery", transactionDate: d(2), isRecurring: false, createdAt: d(2), updatedAt: d(2) },
  { id: "tx-6", userId: USER_ID, accountId: "acc-cc", categoryId: "cat-shopping", type: "expense", amount: 7500, description: "Amazon - Electronics", transactionDate: d(4), isRecurring: false, createdAt: d(4), updatedAt: d(4) },
  { id: "tx-7", userId: USER_ID, accountId: "acc-hdfc", categoryId: "cat-bills", type: "expense", amount: 2800, description: "Electricity Bill", transactionDate: d(6), isRecurring: true, createdAt: d(6), updatedAt: d(6) },
  { id: "tx-8", userId: USER_ID, accountId: "acc-cash", categoryId: "cat-transport", type: "expense", amount: 1500, description: "Petrol & Auto", transactionDate: d(1), isRecurring: false, createdAt: d(1), updatedAt: d(1) },
  { id: "tx-9", userId: USER_ID, accountId: "acc-hdfc", categoryId: "cat-entertainment", type: "expense", amount: 649, description: "Netflix Subscription", transactionDate: d(7), isRecurring: true, createdAt: d(7), updatedAt: d(7) },
  { id: "tx-10", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-subscriptions", type: "expense", amount: 299, description: "Spotify Premium", transactionDate: d(7), isRecurring: true, createdAt: d(7), updatedAt: d(7) },
  { id: "tx-11", userId: USER_ID, accountId: "acc-cc", categoryId: "cat-food", type: "expense", amount: 4200, description: "Zomato - Restaurant orders", transactionDate: d(9), isRecurring: false, createdAt: d(9), updatedAt: d(9) },
  { id: "tx-12", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-insurance", type: "expense", amount: 12500, description: "Health Insurance Premium", transactionDate: d(12), isRecurring: true, createdAt: d(12), updatedAt: d(12) },
  // Last month
  { id: "tx-13", userId: USER_ID, accountId: "acc-hdfc", categoryId: "cat-salary", type: "income", amount: 85000, description: "Monthly Salary", transactionDate: m(1, 1), isRecurring: true, createdAt: m(1, 1), updatedAt: m(1, 1) },
  { id: "tx-14", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-freelance", type: "income", amount: 15000, description: "Freelance - Website", transactionDate: m(1, 15), isRecurring: false, createdAt: m(1, 15), updatedAt: m(1, 15) },
  { id: "tx-15", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-rent", type: "expense", amount: 18000, description: "Monthly Rent", transactionDate: m(1, 3), isRecurring: true, createdAt: m(1, 3), updatedAt: m(1, 3) },
  { id: "tx-16", userId: USER_ID, accountId: "acc-cc", categoryId: "cat-shopping", type: "expense", amount: 12800, description: "Flipkart - Appliances", transactionDate: m(1, 20), isRecurring: false, createdAt: m(1, 20), updatedAt: m(1, 20) },
  { id: "tx-17", userId: USER_ID, accountId: "acc-hdfc", categoryId: "cat-food", type: "expense", amount: 8500, description: "Groceries & Dining", transactionDate: m(1, 10), isRecurring: false, createdAt: m(1, 10), updatedAt: m(1, 10) },
  { id: "tx-18", userId: USER_ID, accountId: "acc-hdfc", categoryId: "cat-bills", type: "expense", amount: 3200, description: "Electricity & Internet", transactionDate: m(1, 8), isRecurring: true, createdAt: m(1, 8), updatedAt: m(1, 8) },
  { id: "tx-19", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-travel", type: "expense", amount: 18000, description: "Weekend trip to Coorg", transactionDate: m(1, 22), isRecurring: false, createdAt: m(1, 22), updatedAt: m(1, 22) },
  // 2 months ago
  { id: "tx-20", userId: USER_ID, accountId: "acc-hdfc", categoryId: "cat-salary", type: "income", amount: 85000, description: "Monthly Salary", transactionDate: m(2, 1), isRecurring: true, createdAt: m(2, 1), updatedAt: m(2, 1) },
  { id: "tx-21", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-investment", type: "income", amount: 12000, description: "Stock Dividends", transactionDate: m(2, 12), isRecurring: false, createdAt: m(2, 12), updatedAt: m(2, 12) },
  { id: "tx-22", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-rent", type: "expense", amount: 18000, description: "Monthly Rent", transactionDate: m(2, 3), isRecurring: true, createdAt: m(2, 3), updatedAt: m(2, 3) },
  { id: "tx-23", userId: USER_ID, accountId: "acc-hdfc", categoryId: "cat-education", type: "expense", amount: 9500, description: "Online Course - React", transactionDate: m(2, 18), isRecurring: false, createdAt: m(2, 18), updatedAt: m(2, 18) },
  { id: "tx-24", userId: USER_ID, accountId: "acc-cc", categoryId: "cat-healthcare", type: "expense", amount: 5500, description: "Doctor visits & Medicines", transactionDate: m(2, 25), isRecurring: false, createdAt: m(2, 25), updatedAt: m(2, 25) },
  // 3 months ago
  { id: "tx-25", userId: USER_ID, accountId: "acc-hdfc", categoryId: "cat-salary", type: "income", amount: 82000, description: "Monthly Salary", transactionDate: m(3, 1), isRecurring: true, createdAt: m(3, 1), updatedAt: m(3, 1) },
  { id: "tx-26", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-freelance", type: "income", amount: 30000, description: "Freelance - App Design", transactionDate: m(3, 20), isRecurring: false, createdAt: m(3, 20), updatedAt: m(3, 20) },
  { id: "tx-27", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-rent", type: "expense", amount: 18000, description: "Monthly Rent", transactionDate: m(3, 3), isRecurring: true, createdAt: m(3, 3), updatedAt: m(3, 3) },
  { id: "tx-28", userId: USER_ID, accountId: "acc-cc", categoryId: "cat-shopping", type: "expense", amount: 8900, description: "Amazon - Clothing", transactionDate: m(3, 14), isRecurring: false, createdAt: m(3, 14), updatedAt: m(3, 14) },
  // 4-5 months ago
  { id: "tx-29", userId: USER_ID, accountId: "acc-hdfc", categoryId: "cat-salary", type: "income", amount: 82000, description: "Monthly Salary", transactionDate: m(4, 1), isRecurring: true, createdAt: m(4, 1), updatedAt: m(4, 1) },
  { id: "tx-30", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-rent", type: "expense", amount: 18000, description: "Monthly Rent", transactionDate: m(4, 3), isRecurring: true, createdAt: m(4, 3), updatedAt: m(4, 3) },
  { id: "tx-31", userId: USER_ID, accountId: "acc-hdfc", categoryId: "cat-salary", type: "income", amount: 82000, description: "Monthly Salary", transactionDate: m(5, 1), isRecurring: true, createdAt: m(5, 1), updatedAt: m(5, 1) },
  { id: "tx-32", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-rent", type: "expense", amount: 18000, description: "Monthly Rent", transactionDate: m(5, 3), isRecurring: true, createdAt: m(5, 3), updatedAt: m(5, 3) },
]

export const SEED_GOALS: Goal[] = [
  {
    id: "goal-1",
    userId: USER_ID,
    name: "Emergency Fund",
    description: "3-6 months of expenses as emergency buffer",
    targetAmount: 100000,
    savedAmount: 25000,
    targetDate: format(subMonths(new Date(), -6), "yyyy-MM-dd"),
    category: "savings",
    icon: "Shield",
    color: "#16A34A",
    priority: "high",
    status: "active",
    createdAt: d(45),
    updatedAt: d(5),
  },
  {
    id: "goal-2",
    userId: USER_ID,
    name: "Car Fund",
    description: "Saving for a new car",
    targetAmount: 500000,
    savedAmount: 100000,
    targetDate: format(subMonths(new Date(), -18), "yyyy-MM-dd"),
    category: "vehicle",
    icon: "Car",
    color: "#2563EB",
    priority: "medium",
    status: "active",
    createdAt: d(60),
    updatedAt: d(10),
  },
  {
    id: "goal-3",
    userId: USER_ID,
    name: "Vacation Fund",
    description: "Europe trip with family",
    targetAmount: 200000,
    savedAmount: 50000,
    targetDate: format(subMonths(new Date(), -12), "yyyy-MM-dd"),
    category: "travel",
    icon: "Plane",
    color: "#7C3AED",
    priority: "low",
    status: "active",
    createdAt: d(30),
    updatedAt: d(15),
  },
]

export const SEED_BUDGETS: Budget[] = [
  { id: "bud-1", userId: USER_ID, categoryId: "cat-food", amount: 15000, month: new Date().getMonth(), year: new Date().getFullYear(), warningThreshold: 80, createdAt: d(30), updatedAt: d(1) },
  { id: "bud-2", userId: USER_ID, categoryId: "cat-shopping", amount: 10000, month: new Date().getMonth(), year: new Date().getFullYear(), warningThreshold: 80, createdAt: d(30), updatedAt: d(1) },
  { id: "bud-3", userId: USER_ID, categoryId: "cat-transport", amount: 5000, month: new Date().getMonth(), year: new Date().getFullYear(), warningThreshold: 75, createdAt: d(30), updatedAt: d(1) },
  { id: "bud-4", userId: USER_ID, categoryId: "cat-entertainment", amount: 3000, month: new Date().getMonth(), year: new Date().getFullYear(), warningThreshold: 80, createdAt: d(30), updatedAt: d(1) },
  { id: "bud-5", userId: USER_ID, categoryId: "cat-bills", amount: 8000, month: new Date().getMonth(), year: new Date().getFullYear(), warningThreshold: 85, createdAt: d(30), updatedAt: d(1) },
  { id: "bud-6", userId: USER_ID, categoryId: "cat-healthcare", amount: 5000, month: new Date().getMonth(), year: new Date().getFullYear(), warningThreshold: 80, createdAt: d(30), updatedAt: d(1) },
]

export const SEED_RECURRING: RecurringTransaction[] = [
  { id: "rec-1", userId: USER_ID, accountId: "acc-hdfc", categoryId: "cat-salary", name: "Monthly Salary", amount: 85000, type: "income", frequency: "monthly", startDate: d(180), nextDueDate: format(subMonths(new Date(), -1), "yyyy-MM-01"), active: true, createdAt: d(180) },
  { id: "rec-2", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-rent", name: "House Rent", amount: 18000, type: "expense", frequency: "monthly", startDate: d(180), nextDueDate: format(subMonths(new Date(), -1), "yyyy-MM-03"), active: true, createdAt: d(180) },
  { id: "rec-3", userId: USER_ID, accountId: "acc-hdfc", categoryId: "cat-entertainment", name: "Netflix", amount: 649, type: "expense", frequency: "monthly", startDate: d(90), nextDueDate: d(-7), active: true, createdAt: d(90) },
  { id: "rec-4", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-subscriptions", name: "Spotify Premium", amount: 299, type: "expense", frequency: "monthly", startDate: d(90), nextDueDate: d(-7), active: true, createdAt: d(90) },
  { id: "rec-5", userId: USER_ID, accountId: "acc-sbi", categoryId: "cat-insurance", name: "Health Insurance", amount: 12500, type: "expense", frequency: "monthly", startDate: d(365), nextDueDate: d(-12), active: true, createdAt: d(365) },
  { id: "rec-6", userId: USER_ID, accountId: "acc-hdfc", categoryId: "cat-bills", name: "Internet Bill", amount: 999, type: "expense", frequency: "monthly", startDate: d(180), nextDueDate: d(-5), active: true, createdAt: d(180) },
]

export const SEED_NOTIFICATIONS: Notification[] = [
  { id: "notif-1", userId: USER_ID, title: "Budget Alert", message: "You've spent 76% of your Food & Dining budget this month.", type: "budget_warning", isRead: false, createdAt: d(1) },
  { id: "notif-2", userId: USER_ID, title: "Upcoming Payment", message: "Netflix subscription renews in 2 days for ₹649.", type: "upcoming_bill", isRead: false, createdAt: d(1) },
  { id: "notif-3", userId: USER_ID, title: "Goal Progress", message: "Great progress! Your Emergency Fund is 25% complete.", type: "goal_deadline", isRead: true, createdAt: d(3) },
  { id: "notif-4", userId: USER_ID, title: "Salary Received", message: "Monthly salary of ₹85,000 received in HDFC Salary account.", type: "info", isRead: true, createdAt: d(5) },
  { id: "notif-5", userId: USER_ID, title: "Monthly Summary", message: "Your September savings rate is 32.4%. Keep it up!", type: "monthly_summary", isRead: true, createdAt: d(7) },
]

export const SEED_ASSETS: Asset[] = [
  { id: "asset-1", userId: USER_ID, name: "SBI Savings Balance", type: "bank", value: 642500, description: "Primary savings account", createdAt: d(90), updatedAt: d(1) },
  { id: "asset-2", userId: USER_ID, name: "HDFC Salary Balance", type: "bank", value: 185000, description: "Salary account", createdAt: d(90), updatedAt: d(1) },
  { id: "asset-3", userId: USER_ID, name: "Mutual Funds", type: "investment", value: 250000, description: "SBI Blue Chip Fund", createdAt: d(365), updatedAt: d(30) },
  { id: "asset-4", userId: USER_ID, name: "Gold", type: "other", value: 150000, description: "Physical gold holdings", createdAt: d(365), updatedAt: d(60) },
  { id: "asset-5", userId: USER_ID, name: "PPF Account", type: "savings", value: 380000, description: "Public Provident Fund", createdAt: d(730), updatedAt: d(90) },
]

export const SEED_LIABILITIES: Liability[] = [
  { id: "liab-1", userId: USER_ID, name: "ICICI Credit Card", type: "credit_card", amount: 28500, description: "Outstanding balance", createdAt: d(30), updatedAt: d(1) },
  { id: "liab-2", userId: USER_ID, name: "Education Loan EMI", type: "emi", amount: 180000, description: "Remaining education loan", createdAt: d(730), updatedAt: d(30) },
]

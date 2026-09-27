import type { Transaction, Goal, Budget, Account, Asset, Liability } from "../types"
import { parseISO, getMonth, getYear } from "date-fns"

export function calcTotalIncome(transactions: Transaction[]): number {
  return transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
}

export function calcTotalExpenses(transactions: Transaction[]): number {
  return transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
}

export function calcBalance(transactions: Transaction[]): number {
  return calcTotalIncome(transactions) - calcTotalExpenses(transactions)
}

export function calcSavings(income: number, expenses: number): number {
  return income - expenses
}

export function calcSavingsRate(income: number, savings: number): number {
  if (income <= 0) return 0
  return Math.max(0, (savings / income) * 100)
}

export function calcGoalProgress(saved: number, target: number): number {
  if (target <= 0) return 0
  return Math.min((saved / target) * 100, 100)
}

export function calcGoalRemaining(saved: number, target: number): number {
  return Math.max(0, target - saved)
}

export function calcBudgetUsage(spent: number, budget: number): number {
  if (budget <= 0) return 0
  return (spent / budget) * 100
}

export function calcBudgetRemaining(spent: number, budget: number): number {
  return Math.max(0, budget - spent)
}

export function calcNetWorth(assets: Asset[], liabilities: Liability[]): number {
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0)
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0)
  return totalAssets - totalLiabilities
}

export function calcTotalGoalTarget(goals: Goal[]): number {
  return goals.filter((g) => g.status === "active").reduce((sum, g) => sum + g.targetAmount, 0)
}

export function calcTotalGoalSaved(goals: Goal[]): number {
  return goals.filter((g) => g.status === "active").reduce((sum, g) => sum + g.savedAmount, 0)
}

export function calcOverallGoalProgress(goals: Goal[]): number {
  const target = calcTotalGoalTarget(goals)
  const saved = calcTotalGoalSaved(goals)
  return calcGoalProgress(saved, target)
}

export function calcMonthlyTransactions(
  transactions: Transaction[],
  month: number,
  year: number
): Transaction[] {
  return transactions.filter((t) => {
    const date = parseISO(t.transactionDate)
    return getMonth(date) === month && getYear(date) === year
  })
}

export function calcCategorySpending(transactions: Transaction[], categoryId: string): number {
  return transactions
    .filter((t) => t.type === "expense" && t.categoryId === categoryId)
    .reduce((sum, t) => sum + t.amount, 0)
}

export function calcAccountBalance(
  account: Account,
  transactions: Transaction[]
): number {
  const accountTransactions = transactions.filter((t) => t.accountId === account.id)
  const income = accountTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)
  const expenses = accountTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)
  return account.openingBalance + income - expenses
}

export function calcBudgetStatus(
  usage: number,
  threshold: number
): "healthy" | "warning" | "exceeded" {
  if (usage >= 100) return "exceeded"
  if (usage >= threshold) return "warning"
  return "healthy"
}

export function calcMonthlyChartData(
  transactions: Transaction[],
  months = 6
): Array<{ month: string; income: number; expenses: number; savings: number }> {
  const now = new Date()
  const data = []
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthTransactions = transactions.filter((t) => {
      const tDate = parseISO(t.transactionDate)
      return getMonth(tDate) === date.getMonth() && getYear(tDate) === date.getFullYear()
    })
    const income = calcTotalIncome(monthTransactions)
    const expenses = calcTotalExpenses(monthTransactions)
    data.push({
      month: date.toLocaleString("default", { month: "short" }),
      income,
      expenses,
      savings: income - expenses,
    })
  }
  return data
}

export function calcPercentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / Math.abs(previous)) * 100
}

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts"
import {
  Wallet, TrendingUp, TrendingDown, PiggyBank, Target, DollarSign,
  Plus, ArrowRight, Clock, ChevronRight, Zap, BarChart3, Shield, Lightbulb
} from "lucide-react"
import { useAuthStore } from "../store/useAuthStore"
import { useFinanceStore } from "../store/useFinanceStore"
import { useUIStore } from "../store/useUIStore"
import StatCard from "../components/common/StatCard"
import ProgressBar from "../components/common/ProgressBar"
import {
  calcTotalIncome, calcTotalExpenses, calcMonthlyChartData,
  calcOverallGoalProgress, calcTotalGoalTarget, calcTotalGoalSaved,
  calcGoalProgress, calcNetWorth, calcCategorySpending, calcBudgetUsage, calcPercentChange
} from "../utils/calculations"
import { formatCurrency, formatCurrencyCompact, formatDate, formatPercent, getGreeting, getCurrentDate, getDaysRemaining } from "../utils/formatters"
import { getMonth, getYear } from "date-fns"

const CHART_PERIODS = ["7D", "1M", "3M", "6M", "1Y"] as const

const CHART_COLORS = {
  income: "#16A34A",
  expenses: "#DC2626",
  savings: "#2563EB",
}

function GoalIcon({ icon, color }: { icon: string; color: string }) {
  const icons: Record<string, string> = { Shield: "🛡️", Car: "🚗", Plane: "✈️", Home: "🏠", Briefcase: "💼", GraduationCap: "🎓" }
  return (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: color + "20" }}>
      {icons[icon] || "🎯"}
    </div>
  )
}

export default function Dashboard() {
  const [period, setPeriod] = useState<(typeof CHART_PERIODS)[number]>("6M")
  const { user } = useAuthStore()
  const { transactions, goals, budgets, categories, accounts, notifications, assets, liabilities, recurring } = useFinanceStore()
  const { setQuickAdd } = useUIStore()
  const navigate = useNavigate()

  const now = new Date()
  const thisMonth = transactions.filter((t) => getMonth(new Date(t.transactionDate)) === now.getMonth() && getYear(new Date(t.transactionDate)) === now.getFullYear())
  const lastMonth = transactions.filter((t) => {
    const d = new Date(t.transactionDate)
    const lm = now.getMonth() === 0 ? 11 : now.getMonth() - 1
    const ly = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
    return getMonth(d) === lm && getYear(d) === ly
  })

  const income = calcTotalIncome(thisMonth)
  const expenses = calcTotalExpenses(thisMonth)
  const savings = income - expenses
  const savingsRate = income > 0 ? (savings / income) * 100 : 0
  const prevIncome = calcTotalIncome(lastMonth)
  const prevExpenses = calcTotalExpenses(lastMonth)
  const netWorth = calcNetWorth(assets, liabilities)

  const activeGoals = goals.filter((g) => g.status === "active")
  const totalTarget = calcTotalGoalTarget(activeGoals)
  const totalSaved = calcTotalGoalSaved(activeGoals)
  const overallProgress = calcOverallGoalProgress(activeGoals)

  const monthCount = period === "7D" ? 1 : period === "1M" ? 1 : period === "3M" ? 3 : period === "6M" ? 6 : 12
  const chartData = calcMonthlyChartData(transactions, monthCount)

  const totalBalance = accounts.reduce((sum, a) => sum + a.currentBalance, 0)

  // Budget insights
  const currentBudgets = budgets.filter((b) => b.month === now.getMonth() && b.year === now.getFullYear())
  const budgetInsights = currentBudgets.map((budget) => {
    const cat = categories.find((c) => c.id === budget.categoryId)
    const spent = calcCategorySpending(thisMonth, budget.categoryId)
    const usage = calcBudgetUsage(spent, budget.amount)
    return { budget, cat, spent, usage }
  }).sort((a, b) => b.usage - a.usage)

  // Upcoming payments
  const upcomingPayments = recurring.filter((r) => r.active && r.type === "expense").slice(0, 4)

  // Recent transactions
  const recent = [...transactions].sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()).slice(0, 6)

  // Insights
  const insights: string[] = []
  if (savingsRate > 0) insights.push(`Your savings rate this month is ${savingsRate.toFixed(1)}% — ${savingsRate > 30 ? "excellent work! 🎉" : "try to reach 30%."} `)
  if (prevExpenses > 0 && expenses < prevExpenses) insights.push(`You spent ${formatPercent(((prevExpenses - expenses) / prevExpenses) * 100)} less than last month.`)
  if (activeGoals.length > 0) insights.push(`Your ${activeGoals[0].name} is ${calcGoalProgress(activeGoals[0].savedAmount, activeGoals[0].targetAmount).toFixed(0)}% complete.`)
  const exceededBudgets = budgetInsights.filter((b) => b.usage >= 100)
  if (exceededBudgets.length > 0) insights.push(`You've exceeded your ${exceededBudgets[0].cat?.name} budget this month.`)

  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-xl border shadow-xl p-3 text-sm" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
        <p className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span style={{ color: "var(--text-muted)" }}>{entry.name}:</span>
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{formatCurrencyCompact(entry.value)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Welcome header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {getGreeting()}, {user?.fullName?.split(" ")[0]} 👋
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {getCurrentDate()} · Here's your financial overview.
          </p>
        </div>
        <button
          onClick={() => setQuickAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus size={15} />
          Add Transaction
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Balance" value={formatCurrencyCompact(totalBalance)} change={calcPercentChange(totalBalance, totalBalance * 0.88)} changeLabel="vs last month" icon={<Wallet size={18} className="text-blue-600" />} iconBg="bg-blue-100 dark:bg-blue-900/30" index={0} />
        <StatCard title="Income" value={formatCurrencyCompact(income)} change={calcPercentChange(income, prevIncome)} changeLabel="vs last month" icon={<TrendingUp size={18} className="text-green-600" />} iconBg="bg-green-100 dark:bg-green-900/30" index={1} />
        <StatCard title="Expenses" value={formatCurrencyCompact(expenses)} change={calcPercentChange(expenses, prevExpenses)} changeLabel="vs last month" icon={<TrendingDown size={18} className="text-red-500" />} iconBg="bg-red-100 dark:bg-red-900/30" index={2} />
        <StatCard title="Savings" value={formatCurrencyCompact(savings)} change={savingsRate} changeLabel={`${savingsRate.toFixed(1)}% rate`} icon={<PiggyBank size={18} className="text-purple-600" />} iconBg="bg-purple-100 dark:bg-purple-900/30" index={3} />
        <StatCard title="Active Goals" value={`${activeGoals.length}`} change={overallProgress} changeLabel={`${overallProgress.toFixed(1)}% overall`} icon={<Target size={18} className="text-orange-500" />} iconBg="bg-orange-100 dark:bg-orange-900/30" index={4} onClick={() => navigate("/goals")} />
        <StatCard title="Net Worth" value={formatCurrencyCompact(netWorth)} change={5.2} changeLabel="vs last month" icon={<DollarSign size={18} className="text-teal-600" />} iconBg="bg-teal-100 dark:bg-teal-900/30" index={5} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Income vs Expenses Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5 xl:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Income vs Expenses</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Monthly trend analysis</p>
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg-page)" }}>
              {CHART_PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${period === p ? "bg-blue-600 text-white shadow-sm" : ""}`}
                  style={period !== p ? { color: "var(--text-muted)" } : {}}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyCompact(v)} width={56} />
              <Tooltip content={customTooltip} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Area type="monotone" dataKey="income" name="Income" stroke={CHART_COLORS.income} strokeWidth={2} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke={CHART_COLORS.expenses} strokeWidth={2} fill="url(#expenseGrad)" dot={false} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="savings" name="Savings" stroke={CHART_COLORS.savings} strokeWidth={2} fill="none" dot={false} activeDot={{ r: 4 }} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Savings overview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-5 flex flex-col"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Monthly Savings</h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>This month</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-4">
            <div className="relative">
              <RadialBarChart width={180} height={180} cx={90} cy={90} innerRadius={55} outerRadius={80} barSize={14} data={[{ value: savingsRate, fill: "#2563EB" }]} startAngle={90} endAngle={90 - (savingsRate / 100) * 360}>
                <RadialBar background={{ fill: "var(--border-color)" }} dataKey="value" cornerRadius={8} fill="#2563EB" />
              </RadialBarChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold nums" style={{ color: "var(--text-primary)" }}>{savingsRate.toFixed(1)}%</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Savings Rate</p>
              </div>
            </div>
          </div>
          <div className="space-y-3 mt-2">
            {[
              { label: "Income", value: income, color: "#16A34A" },
              { label: "Expenses", value: expenses, color: "#DC2626" },
              { label: "Saved", value: savings, color: "#2563EB" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span style={{ color: "var(--text-muted)" }}>{item.label}</span>
                </div>
                <span className="font-semibold nums text-sm" style={{ color: "var(--text-primary)" }}>{formatCurrencyCompact(item.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Goals section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Goals summary */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Financial Goals</h3>
            <button onClick={() => navigate("/goals")} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "Total Goals", value: `${activeGoals.length} Active`, color: "#2563EB" },
              { label: "Total Target", value: formatCurrencyCompact(totalTarget), color: "#7C3AED" },
              { label: "Total Saved", value: formatCurrencyCompact(totalSaved), color: "#16A34A" },
              { label: "Overall", value: `${overallProgress.toFixed(1)}%`, color: "#F59E0B" },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-xl" style={{ background: "var(--bg-page)" }}>
                <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{item.label}</p>
                <p className="font-bold text-sm nums" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
          <ProgressBar value={overallProgress} color="#2563EB" height={8} />
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>{overallProgress.toFixed(1)}% of total target saved</p>
        </motion.div>

        {/* Goal comparison chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33 }} className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Goal Progress Comparison</h3>
          </div>
          {activeGoals.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={activeGoals.map((g) => ({ name: g.name.length > 12 ? g.name.slice(0, 12) + "…" : g.name, saved: g.savedAmount, remaining: g.targetAmount - g.savedAmount }))} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyCompact(v)} width={56} />
                <Tooltip content={customTooltip} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="saved" name="Saved" fill="#16A34A" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="remaining" name="Remaining" fill="#E2E8F0" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No active goals yet</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Individual goals */}
      {activeGoals.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Individual Goal Progress</h3>
            <button onClick={() => navigate("/goals")} className="text-xs text-blue-600 hover:text-blue-700">Manage →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeGoals.slice(0, 3).map((goal) => {
              const progress = calcGoalProgress(goal.savedAmount, goal.targetAmount)
              const daysLeft = getDaysRemaining(goal.targetDate)
              return (
                <div key={goal.id} className="p-4 rounded-xl" style={{ background: "var(--bg-page)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <GoalIcon icon={goal.icon} color={goal.color} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{goal.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${progress >= 100 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                    <span className="nums">{formatCurrencyCompact(goal.savedAmount)} saved</span>
                    <span className="nums">{formatCurrencyCompact(goal.targetAmount)} target</span>
                  </div>
                  <ProgressBar value={progress} color={goal.color} height={6} />
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Activity row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent transactions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Recent Transactions</h3>
            <button onClick={() => navigate("/transactions")} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {recent.length > 0 ? recent.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId)
              return (
                <div key={tx.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: (cat?.color || "#64748B") + "20" }}>
                    <span className="text-sm">{tx.type === "income" ? "💰" : "💸"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{tx.description}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{cat?.name} · {formatDate(tx.transactionDate, "dd MMM")}</p>
                  </div>
                  <span className={`text-sm font-bold nums ${tx.type === "income" ? "text-green-600" : "text-red-500"}`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrencyCompact(tx.amount)}
                  </span>
                </div>
              )
            }) : (
              <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>No transactions yet</p>
            )}
          </div>
        </motion.div>

        {/* Upcoming payments */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Upcoming Payments</h3>
            <button onClick={() => navigate("/recurring")} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingPayments.length > 0 ? upcomingPayments.map((r) => {
              const cat = categories.find((c) => c.id === r.categoryId)
              const daysLeft = getDaysRemaining(r.nextDueDate)
              return (
                <div key={r.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: (cat?.color || "#64748B") + "20" }}>
                    <Clock size={16} style={{ color: cat?.color || "#64748B" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{r.name}</p>
                    <p className="text-xs" style={{ color: daysLeft <= 3 ? "#DC2626" : "var(--text-muted)" }}>
                      {daysLeft <= 0 ? "Overdue" : daysLeft === 1 ? "Tomorrow" : `In ${daysLeft} days`}
                    </p>
                  </div>
                  <span className="text-sm font-bold nums text-red-500">-{formatCurrencyCompact(r.amount)}</span>
                </div>
              )
            }) : (
              <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>No upcoming payments</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Budget overview */}
      {budgetInsights.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Budget Overview</h3>
            <button onClick={() => navigate("/budgets")} className="text-xs text-blue-600 hover:text-blue-700">Manage →</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {budgetInsights.slice(0, 6).map(({ budget, cat, spent, usage }) => {
              const status = usage >= 100 ? "exceeded" : usage >= budget.warningThreshold ? "warning" : "healthy"
              const statusColor = { exceeded: "#DC2626", warning: "#F59E0B", healthy: "#16A34A" }[status]
              return (
                <div key={budget.id} className="p-3 rounded-xl" style={{ background: "var(--bg-page)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{cat?.name || "Budget"}</p>
                    <span className="text-xs font-semibold" style={{ color: statusColor }}>{usage.toFixed(0)}%</span>
                  </div>
                  <ProgressBar value={usage} color={statusColor} height={5} />
                  <div className="flex justify-between text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                    <span className="nums">{formatCurrencyCompact(spent)} spent</span>
                    <span className="nums">{formatCurrencyCompact(budget.amount)} budget</span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }} className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={16} className="text-amber-500" />
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Financial Insights</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "var(--bg-page)" }}>
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <Zap size={13} className="text-amber-500" />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{insight}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

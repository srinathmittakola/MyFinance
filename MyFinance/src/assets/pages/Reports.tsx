import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useFinanceStore } from "../store/useFinanceStore"
import { formatCurrency, formatCurrencyCompact, formatPercent } from "../utils/formatters"
import { calcMonthlyChartData, calcTotalIncome, calcTotalExpenses, calcNetWorth } from "../utils/calculations"
import { subMonths, getMonth, getYear, format } from "date-fns"

const PERIODS = [
  { label: "This Month", value: "1m" },
  { label: "Last Month", value: "last" },
  { label: "3 Months", value: "3m" },
  { label: "6 Months", value: "6m" },
  { label: "1 Year", value: "1y" },
]

export default function Reports() {
  const { transactions, goals, budgets, categories, assets, liabilities } = useFinanceStore()
  const [period, setPeriod] = useState("6m")

  const now = new Date()
  const monthCount = period === "1m" ? 1 : period === "3m" ? 3 : period === "6m" ? 6 : 12

  const periodTx = useMemo(() => {
    if (period === "last") {
      const lm = now.getMonth() === 0 ? 11 : now.getMonth() - 1
      const ly = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
      return transactions.filter((t) => { const d = new Date(t.transactionDate); return d.getMonth() === lm && d.getFullYear() === ly })
    }
    const cutoff = subMonths(now, monthCount)
    return transactions.filter((t) => new Date(t.transactionDate) >= cutoff)
  }, [transactions, period, monthCount])

  const chartData = period !== "last" ? calcMonthlyChartData(transactions, monthCount) : calcMonthlyChartData(transactions, 1)

  const totalIncome = calcTotalIncome(periodTx)
  const totalExpenses = calcTotalExpenses(periodTx)
  const totalSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0
  const netWorth = calcNetWorth(assets, liabilities)

  const catSpending = useMemo(() => {
    const map: Record<string, number> = {}
    periodTx.filter((t) => t.type === "expense").forEach((t) => { map[t.categoryId] = (map[t.categoryId] || 0) + t.amount })
    return Object.entries(map).map(([id, total]) => ({ cat: categories.find((c) => c.id === id), total })).sort((a, b) => b.total - a.total)
  }, [periodTx, categories])

  const netWorthHistory = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(now, 5 - i)
    return { month: format(d, "MMM"), netWorth: netWorth * (0.85 + i * 0.03) }
  })

  const customTip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-xl border shadow-xl p-3 text-sm" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
        <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{label}</p>
        {payload.map((e: any) => (
          <div key={e.dataKey} className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
            <span style={{ color: "var(--text-muted)" }}>{e.name}:</span>
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{formatCurrencyCompact(e.value)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      {/* Period filter */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          {PERIODS.map((p) => (
            <button key={p.value} onClick={() => setPeriod(p.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p.value ? "bg-blue-600 text-white" : ""}`} style={period !== p.value ? { color: "var(--text-muted)" } : {}}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Income", value: formatCurrencyCompact(totalIncome), color: "#16A34A" },
          { label: "Total Expenses", value: formatCurrencyCompact(totalExpenses), color: "#DC2626" },
          { label: "Net Savings", value: formatCurrencyCompact(totalSavings), color: totalSavings >= 0 ? "#2563EB" : "#DC2626" },
          { label: "Savings Rate", value: formatPercent(savingsRate), color: "#7C3AED" },
          { label: "Net Worth", value: formatCurrencyCompact(netWorth), color: "#0891B2" },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{item.label}</p>
            <p className="text-xl font-bold nums" style={{ color: item.color }}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Income vs Expenses */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="rptIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rptExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyCompact(v)} width={56} />
              <Tooltip content={customTip} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#16A34A" strokeWidth={2} fill="url(#rptIncome)" dot={false} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#DC2626" strokeWidth={2} fill="url(#rptExpense)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Net Worth Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={netWorthHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyCompact(v)} width={56} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Line type="monotone" dataKey="netWorth" name="Net Worth" stroke="#0891B2" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category spending */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Expense by Category</h3>
          {catSpending.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={catSpending.slice(0, 8).map((d) => ({ name: d.cat?.name?.slice(0, 10) || "Other", amount: d.total, fill: d.cat?.color || "#64748B" }))} layout="vertical" margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyCompact(v)} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="amount" name="Spent" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {catSpending.slice(0, 8).map((entry, i) => <Cell key={i} fill={entry.cat?.color || "#64748B"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>No expense data for this period</p>}
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Savings Bar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyCompact(v)} width={56} />
              <Tooltip content={customTip} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" name="Income" fill="#16A34A" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="expenses" name="Expenses" fill="#DC2626" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="savings" name="Savings" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

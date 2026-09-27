import { useMemo } from "react"
import { TrendingDown, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useFinanceStore } from "../store/useFinanceStore"
import { useUIStore } from "../store/useUIStore"
import { formatCurrency, formatCurrencyCompact, formatDate } from "../utils/formatters"
import { calcMonthlyChartData } from "../utils/calculations"
import EmptyState from "../components/common/EmptyState"

export default function Expenses() {
  const { transactions, categories, accounts } = useFinanceStore()
  const { setQuickAdd } = useUIStore()

  const expenses = transactions.filter((t) => t.type === "expense")
  const sorted = [...expenses].sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())

  const now = new Date()
  const thisMonth = expenses.filter((t) => { const d = new Date(t.transactionDate); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() })
  const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0)
  const thisMonthTotal = thisMonth.reduce((s, t) => s + t.amount, 0)
  const avgDaily = thisMonthTotal / now.getDate()
  const largest = expenses.reduce((max, t) => t.amount > max ? t.amount : max, 0)

  const chartData = calcMonthlyChartData(transactions, 6).map((d) => ({ month: d.month, expenses: d.expenses }))

  const byCat = useMemo(() => {
    const map: Record<string, number> = {}
    expenses.forEach((t) => { map[t.categoryId] = (map[t.categoryId] || 0) + t.amount })
    return Object.entries(map).map(([catId, total]) => ({ cat: categories.find((c) => c.id === catId), total })).sort((a, b) => b.total - a.total)
  }, [expenses, categories])

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{expenses.length} expense records</p>
        <button onClick={() => setQuickAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">
          <Plus size={15} />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Expenses", value: formatCurrencyCompact(totalExpenses), color: "#DC2626" },
          { label: "This Month", value: formatCurrencyCompact(thisMonthTotal), color: "#EF4444" },
          { label: "Daily Average", value: formatCurrencyCompact(avgDaily), color: "#F59E0B" },
          { label: "Largest Expense", value: formatCurrencyCompact(largest), color: "#7C3AED" },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{item.label}</p>
            <p className="text-xl font-bold nums" style={{ color: item.color }}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5 xl:col-span-2">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Monthly Expense Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyCompact(v)} width={56} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="expenses" name="Expenses" fill="#DC2626" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>By Category</h3>
          {byCat.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={byCat.slice(0, 6).map((d) => ({ name: d.cat?.name || "Other", value: d.total, fill: d.cat?.color || "#64748B" }))} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                    {byCat.slice(0, 6).map((d, i) => <Cell key={i} fill={d.cat?.color || "#64748B"} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {byCat.slice(0, 5).map(({ cat, total }) => (
                  <div key={cat?.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: cat?.color || "#64748B" }} />
                      <span style={{ color: "var(--text-secondary)" }}>{cat?.name || "Other"}</span>
                    </div>
                    <span className="nums font-semibold text-red-500">{formatCurrencyCompact(total)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>No data yet</p>}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border-color)" }}>
          <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Expense History</h3>
        </div>
        {sorted.length === 0 ? (
          <EmptyState icon={<TrendingDown size={28} />} title="No expenses recorded" description="Track your spending to understand where your money goes." action={{ label: "Add Expense", onClick: () => setQuickAdd(true) }} />
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border-color)" }}>
            {sorted.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId)
              const acc = accounts.find((a) => a.id === tx.accountId)
              return (
                <div key={tx.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: (cat?.color || "#DC2626") + "20" }}>
                    <TrendingDown size={16} style={{ color: cat?.color || "#DC2626" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{tx.description}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{cat?.name} · {acc?.name} · {formatDate(tx.transactionDate)}</p>
                  </div>
                  <span className="text-sm font-bold nums text-red-500">-{formatCurrency(tx.amount)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

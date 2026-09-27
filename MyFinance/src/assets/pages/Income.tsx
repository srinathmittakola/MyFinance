import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { TrendingUp, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useFinanceStore } from "../store/useFinanceStore"
import { useUIStore } from "../store/useUIStore"
import { formatCurrency, formatCurrencyCompact, formatDate } from "../utils/formatters"
import { calcMonthlyChartData } from "../utils/calculations"
import EmptyState from "../components/common/EmptyState"

export default function Income() {
  const { transactions, categories, accounts } = useFinanceStore()
  const { setQuickAdd } = useUIStore()
  const navigate = useNavigate()

  const income = transactions.filter((t) => t.type === "income")
  const sorted = [...income].sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())

  const now = new Date()
  const thisMonth = income.filter((t) => { const d = new Date(t.transactionDate); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() })
  const lastMonth = income.filter((t) => { const d = new Date(t.transactionDate); const lm = now.getMonth() === 0 ? 11 : now.getMonth() - 1; const ly = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(); return d.getMonth() === lm && d.getFullYear() === ly })

  const totalIncome = income.reduce((s, t) => s + t.amount, 0)
  const thisMonthTotal = thisMonth.reduce((s, t) => s + t.amount, 0)
  const lastMonthTotal = lastMonth.reduce((s, t) => s + t.amount, 0)
  const avgMonthly = totalIncome / 6

  const chartData = calcMonthlyChartData(transactions, 6).map((d) => ({ month: d.month, income: d.income }))

  const byCat = useMemo(() => {
    const map: Record<string, number> = {}
    income.forEach((t) => { map[t.categoryId] = (map[t.categoryId] || 0) + t.amount })
    return Object.entries(map).map(([catId, total]) => ({ cat: categories.find((c) => c.id === catId), total })).sort((a, b) => b.total - a.total)
  }, [income, categories])

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{income.length} income records</p>
        <button onClick={() => setQuickAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors">
          <Plus size={15} />
          Add Income
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Income", value: formatCurrencyCompact(totalIncome), color: "#16A34A" },
          { label: "This Month", value: formatCurrencyCompact(thisMonthTotal), color: "#2563EB" },
          { label: "Last Month", value: formatCurrencyCompact(lastMonthTotal), color: "#7C3AED" },
          { label: "Avg Monthly", value: formatCurrencyCompact(avgMonthly), color: "#F59E0B" },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{item.label}</p>
            <p className="text-xl font-bold nums" style={{ color: item.color }}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5 xl:col-span-2">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Monthly Income Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyCompact(v)} width={56} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="income" name="Income" fill="#16A34A" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>By Source</h3>
          <div className="space-y-3">
            {byCat.slice(0, 6).map(({ cat, total }) => (
              <div key={cat?.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: cat?.color || "#64748B" }} />
                  <span style={{ color: "var(--text-secondary)" }}>{cat?.name || "Other"}</span>
                </div>
                <span className="nums font-semibold text-green-600">{formatCurrencyCompact(total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border-color)" }}>
          <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Income History</h3>
        </div>
        {sorted.length === 0 ? (
          <EmptyState icon={<TrendingUp size={28} />} title="No income recorded" description="Add your salary, freelance income and other sources." action={{ label: "Add Income", onClick: () => setQuickAdd(true) }} />
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border-color)" }}>
            {sorted.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId)
              const acc = accounts.find((a) => a.id === tx.accountId)
              return (
                <div key={tx.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: (cat?.color || "#16A34A") + "20" }}>
                    <TrendingUp size={16} style={{ color: cat?.color || "#16A34A" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{tx.description}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{cat?.name} · {acc?.name} · {formatDate(tx.transactionDate)}</p>
                  </div>
                  <span className="text-sm font-bold nums text-green-600">+{formatCurrency(tx.amount)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, PieChart } from "lucide-react"
import { useForm } from "react-hook-form"
import { PieChart as RPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { useFinanceStore } from "../store/useFinanceStore"
import { useUIStore } from "../store/useUIStore"
import Modal from "../components/common/Modal"
import ConfirmDialog from "../components/common/ConfirmDialog"
import EmptyState from "../components/common/EmptyState"
import ProgressBar from "../components/common/ProgressBar"
import { formatCurrency, formatPercent } from "../utils/formatters"
import { calcCategorySpending, calcBudgetUsage, calcBudgetStatus } from "../utils/calculations"
import type { Budget } from "../types"

export default function Budgets() {
  const { budgets, categories, transactions, addBudget, updateBudget, deleteBudget } = useFinanceStore()
  const { addToast } = useUIStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Budget | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Budget | null>(null)

  const now = new Date()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Budget, "id" | "userId" | "createdAt" | "updatedAt">>({
    defaultValues: { month: now.getMonth(), year: now.getFullYear(), warningThreshold: 80 },
  })

  const currentBudgets = budgets.filter((b) => b.month === now.getMonth() && b.year === now.getFullYear())
  const thisMonthTx = transactions.filter((t) => {
    const d = new Date(t.transactionDate)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const budgetData = useMemo(() =>
    currentBudgets.map((budget) => {
      const cat = categories.find((c) => c.id === budget.categoryId)
      const spent = calcCategorySpending(thisMonthTx, budget.categoryId)
      const usage = calcBudgetUsage(spent, budget.amount)
      const status = calcBudgetStatus(usage, budget.warningThreshold)
      return { budget, cat, spent, usage, status }
    }).sort((a, b) => b.usage - a.usage),
    [currentBudgets, categories, thisMonthTx]
  )

  const totalBudget = currentBudgets.reduce((s, b) => s + b.amount, 0)
  const totalSpent = budgetData.reduce((s, d) => s + d.spent, 0)
  const totalUsage = calcBudgetUsage(totalSpent, totalBudget)

  const pieData = budgetData.map((d) => ({ name: d.cat?.name || "Budget", value: d.spent, fill: d.cat?.color || "#64748B" }))

  const openAdd = () => {
    setEditTarget(null)
    reset({ month: now.getMonth(), year: now.getFullYear(), warningThreshold: 80 })
    setModalOpen(true)
  }

  const openEdit = (budget: Budget) => {
    setEditTarget(budget)
    reset({ ...budget })
    setModalOpen(true)
  }

  const onSubmit = (data: any) => {
    if (editTarget) {
      updateBudget(editTarget.id, { ...data, amount: Number(data.amount), warningThreshold: Number(data.warningThreshold) })
      addToast("Budget updated")
    } else {
      addBudget({ ...data, amount: Number(data.amount), warningThreshold: Number(data.warningThreshold), userId: "demo-user-1" })
      addToast("Budget created")
    }
    setModalOpen(false)
  }

  const STATUS_COLOR = { healthy: "#16A34A", warning: "#F59E0B", exceeded: "#DC2626" }

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {new Date().toLocaleString("default", { month: "long", year: "numeric" })} · {currentBudgets.length} budgets
          </p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          <Plus size={15} />
          New Budget
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Budget", value: formatCurrency(totalBudget), color: "#2563EB" },
          { label: "Total Spent", value: formatCurrency(totalSpent), color: "#DC2626" },
          { label: "Remaining", value: formatCurrency(Math.max(0, totalBudget - totalSpent)), color: "#16A34A" },
          { label: "Utilization", value: formatPercent(totalUsage), color: totalUsage >= 100 ? "#DC2626" : totalUsage >= 80 ? "#F59E0B" : "#16A34A" },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{item.label}</p>
            <p className="text-2xl font-bold nums" style={{ color: item.color }}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Budget cards */}
        <div className="xl:col-span-2 space-y-3">
          {budgetData.length === 0 ? (
            <div className="card">
              <EmptyState icon={<PieChart size={28} />} title="No budgets set" description="Create monthly budgets to track your spending." action={{ label: "Create Budget", onClick: openAdd }} />
            </div>
          ) : (
            budgetData.map(({ budget, cat, spent, usage, status }, i) => (
              <motion.div key={budget.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: (cat?.color || "#64748B") + "20" }}>
                      <span style={{ color: cat?.color || "#64748B", fontSize: 16 }}>💰</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{cat?.name || "Budget"}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Warning at {budget.warningThreshold}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: STATUS_COLOR[status] + "20", color: STATUS_COLOR[status] }}>
                      {status === "healthy" ? "On Track" : status === "warning" ? "Warning" : "Exceeded"}
                    </span>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(budget)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" style={{ color: "var(--text-muted)" }}><Edit2 size={13} /></button>
                      <button onClick={() => setDeleteTarget(budget)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </div>
                </div>
                <ProgressBar value={usage} color={STATUS_COLOR[status]} height={8} />
                <div className="flex justify-between text-xs mt-2">
                  <span style={{ color: "var(--text-muted)" }}>
                    <span className="nums font-semibold" style={{ color: "var(--text-primary)" }}>{formatCurrency(spent)}</span> spent
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    <span className="nums font-semibold" style={{ color: "var(--text-primary)" }}>{formatCurrency(budget.amount)}</span> budget · <span className="nums" style={{ color: STATUS_COLOR[status] }}>{usage.toFixed(1)}%</span>
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pie chart */}
        {pieData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
            <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Spending Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RPieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </RPieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: item.fill }} />
                    <span style={{ color: "var(--text-secondary)" }}>{item.name}</span>
                  </div>
                  <span className="nums font-semibold" style={{ color: "var(--text-primary)" }}>{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Budget" : "Create Budget"} size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Category *</label>
            <select {...register("categoryId", { required: true })} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
              <option value="">Select category</option>
              {categories.filter((c) => c.type === "expense" || c.type === "both").map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Budget Amount *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-muted)" }}>₹</span>
              <input type="number" min="1" placeholder="15000" {...register("amount", { required: true, min: 1 })} className="w-full pl-8 pr-3 py-2.5 rounded-xl border text-sm outline-none focus:border-blue-500" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Warning Threshold (%)</label>
            <input type="number" min="50" max="99" {...register("warningThreshold")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Warn when spending reaches this % of budget</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl text-sm border" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Cancel</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">{editTarget ? "Update" : "Create"} Budget</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) { deleteBudget(deleteTarget.id); addToast("Budget deleted"); setDeleteTarget(null) } }} title="Delete Budget" message="This budget will be permanently removed." confirmLabel="Delete" />
    </div>
  )
}

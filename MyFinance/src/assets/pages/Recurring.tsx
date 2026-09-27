import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, RefreshCw, CheckCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { useFinanceStore } from "../store/useFinanceStore"
import { useUIStore } from "../store/useUIStore"
import Modal from "../components/common/Modal"
import ConfirmDialog from "../components/common/ConfirmDialog"
import EmptyState from "../components/common/EmptyState"
import { formatCurrency, formatDate, getDaysRemaining } from "../utils/formatters"
import type { RecurringTransaction } from "../types"
import { FREQUENCIES } from "../constants/data"
import { format } from "date-fns"

export default function Recurring() {
  const { recurring, categories, accounts, addRecurring, updateRecurring, deleteRecurring } = useFinanceStore()
  const { addToast } = useUIStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<RecurringTransaction | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<RecurringTransaction | null>(null)

  const { register, handleSubmit, reset } = useForm<Omit<RecurringTransaction, "id" | "userId" | "createdAt">>({
    defaultValues: { type: "expense", frequency: "monthly", active: true, startDate: format(new Date(), "yyyy-MM-dd"), nextDueDate: format(new Date(), "yyyy-MM-dd") },
  })

  const openAdd = () => {
    setEditTarget(null)
    reset({ type: "expense", frequency: "monthly", active: true, startDate: format(new Date(), "yyyy-MM-dd"), nextDueDate: format(new Date(), "yyyy-MM-dd") })
    setModalOpen(true)
  }

  const onSubmit = (data: any) => {
    if (editTarget) {
      updateRecurring(editTarget.id, { ...data, amount: Number(data.amount) })
      addToast("Recurring transaction updated")
    } else {
      addRecurring({ ...data, amount: Number(data.amount), userId: "demo-user-1" })
      addToast("Recurring transaction added")
    }
    setModalOpen(false)
  }

  const income = recurring.filter((r) => r.type === "income")
  const expenses = recurring.filter((r) => r.type === "expense")

  const RecurringItem = ({ r }: { r: RecurringTransaction }) => {
    const cat = categories.find((c) => c.id === r.categoryId)
    const acc = accounts.find((a) => a.id === r.accountId)
    const daysLeft = getDaysRemaining(r.nextDueDate)
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: (cat?.color || "#64748B") + "20" }}>
          <RefreshCw size={18} style={{ color: cat?.color || "#64748B" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{r.name}</p>
            {!r.active && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800" style={{ color: "var(--text-muted)" }}>Inactive</span>}
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {cat?.name} · {acc?.name} · {FREQUENCIES.find((f) => f.value === r.frequency)?.label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: daysLeft <= 3 ? "#DC2626" : "var(--text-muted)" }}>
            Next: {formatDate(r.nextDueDate)} {daysLeft > 0 ? `(${daysLeft}d)` : daysLeft === 0 ? "(Today)" : "(Overdue)"}
          </p>
        </div>
        <div className="text-right">
          <p className={`font-bold nums ${r.type === "income" ? "text-green-600" : "text-red-500"}`}>
            {r.type === "income" ? "+" : "-"}{formatCurrency(r.amount)}
          </p>
        </div>
        <div className="flex gap-1 ml-2">
          <button onClick={() => { setEditTarget(r); reset(r); setModalOpen(true) }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10" style={{ color: "var(--text-muted)" }}><Edit2 size={14} /></button>
          <button onClick={() => setDeleteTarget(r)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400"><Trash2 size={14} /></button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="p-6 space-y-5 max-w-[900px] mx-auto">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{recurring.length} recurring transactions</p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">
          <Plus size={15} />
          Add Recurring
        </button>
      </div>

      {recurring.length === 0 ? (
        <div className="card">
          <EmptyState icon={<RefreshCw size={28} />} title="No recurring transactions" description="Add salary, rent, subscriptions and other regular transactions." action={{ label: "Add Recurring", onClick: openAdd }} />
        </div>
      ) : (
        <div className="space-y-6">
          {income.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Recurring Income</p>
              <div className="space-y-2">{income.map((r) => <RecurringItem key={r.id} r={r} />)}</div>
            </div>
          )}
          {expenses.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Recurring Expenses</p>
              <div className="space-y-2">{expenses.map((r) => <RecurringItem key={r.id} r={r} />)}</div>
            </div>
          )}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Recurring" : "Add Recurring"} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Name *</label>
              <input placeholder="Netflix, Salary, etc." {...register("name", { required: true })} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-blue-500" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Type</label>
              <select {...register("type")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-muted)" }}>₹</span>
                <input type="number" min="1" {...register("amount", { required: true })} className="w-full pl-8 pr-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Frequency</label>
              <select {...register("frequency")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Category</label>
              <select {...register("categoryId")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                <option value="">Select</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Account</label>
              <select {...register("accountId")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                <option value="">Select</option>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Start Date</label>
              <input type="date" {...register("startDate")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Next Due Date</label>
              <input type="date" {...register("nextDueDate")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl text-sm border" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Cancel</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">{editTarget ? "Update" : "Add"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) { deleteRecurring(deleteTarget.id); addToast("Deleted"); setDeleteTarget(null) } }} title="Delete Recurring" message="This recurring transaction will be permanently removed." confirmLabel="Delete" />
    </div>
  )
}

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, ChevronDown, Edit2, Trash2, Copy, Eye, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { useFinanceStore } from "../store/useFinanceStore"
import { useUIStore } from "../store/useUIStore"
import Modal from "../components/common/Modal"
import ConfirmDialog from "../components/common/ConfirmDialog"
import EmptyState from "../components/common/EmptyState"
import { formatCurrency, formatDate } from "../utils/formatters"
import type { Transaction } from "../types"
import { format } from "date-fns"

type TxForm = Omit<Transaction, "id" | "createdAt" | "updatedAt" | "userId" | "isRecurring">

const PAGE_SIZE = 12

export default function Transactions() {
  const { transactions, categories, accounts, addTransaction, updateTransaction, deleteTransaction } = useFinanceStore()
  const { addToast } = useUIStore()
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense" | "transfer">("all")
  const [filterCat, setFilterCat] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest")
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Transaction | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null)
  const [viewTarget, setViewTarget] = useState<Transaction | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TxForm>({
    defaultValues: { transactionDate: format(new Date(), "yyyy-MM-dd"), type: "expense" },
  })

  const openAdd = () => {
    setEditTarget(null)
    reset({ transactionDate: format(new Date(), "yyyy-MM-dd"), type: "expense" })
    setModalOpen(true)
  }

  const openEdit = (tx: Transaction) => {
    setEditTarget(tx)
    reset({ ...tx })
    setModalOpen(true)
  }

  const onSubmit = (data: TxForm) => {
    if (editTarget) {
      updateTransaction(editTarget.id, { ...data, amount: Number(data.amount) })
      addToast("Transaction updated successfully")
    } else {
      addTransaction({ ...data, amount: Number(data.amount), userId: "demo-user-1", isRecurring: false })
      addToast("Transaction added successfully")
    }
    setModalOpen(false)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteTransaction(deleteTarget.id)
    addToast("Transaction deleted")
    setDeleteTarget(null)
  }

  const handleDuplicate = (tx: Transaction) => {
    addTransaction({
      ...tx,
      description: `${tx.description} (copy)`,
      transactionDate: format(new Date(), "yyyy-MM-dd"),
      userId: "demo-user-1",
    })
    addToast("Transaction duplicated")
  }

  const filtered = useMemo(() => {
    let list = [...transactions]
    if (search) list = list.filter((t) => t.description.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== "all") list = list.filter((t) => t.type === filterType)
    if (filterCat) list = list.filter((t) => t.categoryId === filterCat)
    list.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
      if (sortBy === "oldest") return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()
      if (sortBy === "highest") return b.amount - a.amount
      return a.amount - b.amount
    })
    return list
  }, [transactions, search, filterType, filterCat, sortBy])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalIncome = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const totalExpenses = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{filtered.length} transactions</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          <Plus size={15} />
          Add Transaction
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Income", value: totalIncome, color: "#16A34A", bg: "bg-green-100 dark:bg-green-900/20" },
          { label: "Expenses", value: totalExpenses, color: "#DC2626", bg: "bg-red-100 dark:bg-red-900/20" },
          { label: "Balance", value: totalIncome - totalExpenses, color: totalIncome >= totalExpenses ? "#16A34A" : "#DC2626", bg: "bg-blue-100 dark:bg-blue-900/20" },
        ].map((item) => (
          <div key={item.label} className={`card p-4 ${item.bg}`}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{item.label}</p>
            <p className="text-xl font-bold nums" style={{ color: item.color }}>{formatCurrency(Math.abs(item.value))}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search transactions..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none"
            style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}><X size={14} /></button>}
        </div>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--bg-page)" }}>
          {(["all", "income", "expense"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setFilterType(t); setPage(1) }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterType === t ? "bg-blue-600 text-white" : ""}`}
              style={filterType !== t ? { color: "var(--text-muted)" } : {}}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={filterCat}
          onChange={(e) => { setFilterCat(e.target.value); setPage(1) }}
          className="px-3 py-2 rounded-lg text-sm border outline-none"
          style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 rounded-lg text-sm border outline-none"
          style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
        {paged.length === 0 ? (
          <EmptyState title="No transactions found" description="Add your first transaction to start tracking finances." action={{ label: "Add Transaction", onClick: openAdd }} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  {["Date", "Description", "Category", "Account", "Type", "Amount", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border-color)" }}>
                {paged.map((tx) => {
                  const cat = categories.find((c) => c.id === tx.categoryId)
                  const acc = accounts.find((a) => a.id === tx.accountId)
                  return (
                    <tr key={tx.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{formatDate(tx.transactionDate, "dd MMM")}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium truncate max-w-[180px]" style={{ color: "var(--text-primary)" }}>{tx.description}</p>
                        {tx.notes && <p className="text-xs truncate max-w-[180px]" style={{ color: "var(--text-muted)" }}>{tx.notes}</p>}
                      </td>
                      <td className="px-4 py-3">
                        {cat && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium" style={{ background: cat.color + "20", color: cat.color }}>
                            {cat.name}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{acc?.name || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          tx.type === "income" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : tx.type === "expense" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-blue-100 text-blue-700"
                        }`}>{tx.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold nums ${tx.type === "income" ? "text-green-600" : "text-red-500"}`}>
                          {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setViewTarget(tx)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" style={{ color: "var(--text-muted)" }} title="View"><Eye size={14} /></button>
                          <button onClick={() => openEdit(tx)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" style={{ color: "var(--text-muted)" }} title="Edit"><Edit2 size={14} /></button>
                          <button onClick={() => handleDuplicate(tx)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" style={{ color: "var(--text-muted)" }} title="Duplicate"><Copy size={14} /></button>
                          <button onClick={() => setDeleteTarget(tx)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-400" title="Delete"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "var(--border-color)" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs border disabled:opacity-40 transition-colors hover:bg-gray-50 dark:hover:bg-white/10"
                style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Prev</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${page === p ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-50 dark:hover:bg-white/10"}`}
                  style={page !== p ? { borderColor: "var(--border-color)", color: "var(--text-secondary)" } : {}}>{p}</button>
              ))}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs border disabled:opacity-40 transition-colors hover:bg-gray-50 dark:hover:bg-white/10"
                style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Next</button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Transaction" : "Add Transaction"}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Type *</label>
              <select {...register("type", { required: true })} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "var(--text-muted)" }}>₹</span>
                <input type="number" step="0.01" min="0.01" placeholder="0.00" {...register("amount", { required: true, min: 0.01 })} className="w-full pl-8 pr-3 py-2.5 rounded-xl border text-sm outline-none focus:border-blue-500" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
              </div>
              {errors.amount && <p className="mt-1 text-xs text-red-500">Required</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Description *</label>
            <input placeholder="What's this for?" {...register("description", { required: true })} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-blue-500" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Category</label>
              <select {...register("categoryId")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Account</label>
              <select {...register("accountId")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                <option value="">Select account</option>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Date *</label>
              <input type="date" {...register("transactionDate", { required: true })} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-blue-500" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Payment Method</label>
              <input placeholder="UPI, Cash, etc." {...register("paymentMethod")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Notes</label>
            <textarea rows={2} placeholder="Optional notes..." {...register("notes")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl text-sm border" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Cancel</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">{editTarget ? "Update" : "Add"} Transaction</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      {viewTarget && (
        <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="Transaction Details" size="sm">
          <div className="p-6 space-y-3">
            {[
              { label: "Description", value: viewTarget.description },
              { label: "Amount", value: formatCurrency(viewTarget.amount) },
              { label: "Type", value: viewTarget.type },
              { label: "Category", value: categories.find((c) => c.id === viewTarget.categoryId)?.name || "—" },
              { label: "Account", value: accounts.find((a) => a.id === viewTarget.accountId)?.name || "—" },
              { label: "Date", value: formatDate(viewTarget.transactionDate) },
              { label: "Payment Method", value: viewTarget.paymentMethod || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span style={{ color: "var(--text-muted)" }}>{label}</span>
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{value}</span>
              </div>
            ))}
            {viewTarget.notes && (
              <div className="pt-2 border-t" style={{ borderColor: "var(--border-color)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Notes</p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>{viewTarget.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Transaction" message="This transaction will be permanently removed. This action cannot be undone." confirmLabel="Delete" />
    </div>
  )
}

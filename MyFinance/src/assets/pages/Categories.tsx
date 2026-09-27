import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, Tag } from "lucide-react"
import { useForm } from "react-hook-form"
import { useFinanceStore } from "../store/useFinanceStore"
import { useUIStore } from "../store/useUIStore"
import Modal from "../components/common/Modal"
import ConfirmDialog from "../components/common/ConfirmDialog"
import EmptyState from "../components/common/EmptyState"
import type { Category } from "../types"

const COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#DC2626", "#7C3AED", "#0891B2", "#EC4899", "#64748B", "#D97706", "#0F766E"]

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinanceStore()
  const { addToast } = useUIStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")

  const { register, handleSubmit, reset } = useForm<Omit<Category, "id" | "userId" | "createdAt">>({
    defaultValues: { type: "expense", color: "#2563EB", isDefault: false },
  })

  const openAdd = () => {
    setEditTarget(null)
    reset({ type: "expense", color: "#2563EB", isDefault: false, icon: "Tag" })
    setModalOpen(true)
  }

  const openEdit = (cat: Category) => {
    if (cat.isDefault) { addToast("Default categories cannot be edited", "info"); return }
    setEditTarget(cat)
    reset({ ...cat })
    setModalOpen(true)
  }

  const onSubmit = (data: any) => {
    if (editTarget) {
      updateCategory(editTarget.id, data)
      addToast("Category updated")
    } else {
      addCategory({ ...data, userId: "demo-user-1" })
      addToast("Category created")
    }
    setModalOpen(false)
  }

  const filtered = categories.filter((c) => filterType === "all" || c.type === filterType || c.type === "both")
  const income = filtered.filter((c) => c.type === "income" || c.type === "both")
  const expense = filtered.filter((c) => c.type === "expense" || c.type === "both")

  const CatList = ({ cats, label }: { cats: Category[]; label: string }) => (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider px-1 mb-3" style={{ color: "var(--text-muted)" }}>{label}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
        {cats.map((cat, i) => (
          <motion.div key={cat.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} className="card p-4 flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: cat.color + "20" }}>
              <span className="text-base">🏷️</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{cat.name}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{cat.isDefault ? "Default" : "Custom"}</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(cat)} className="p-1 rounded transition-colors hover:bg-gray-100 dark:hover:bg-white/10" style={{ color: "var(--text-muted)" }}><Edit2 size={13} /></button>
              {!cat.isDefault && <button onClick={() => setDeleteTarget(cat)} className="p-1 rounded transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400"><Trash2 size={13} /></button>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          {(["all", "income", "expense"] as const).map((t) => (
            <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterType === t ? "bg-blue-600 text-white" : ""}`} style={filterType !== t ? { color: "var(--text-muted)" } : {}}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          <Plus size={15} />
          New Category
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={<Tag size={28} />} title="No categories" description="Create custom categories to organize your transactions." action={{ label: "Create Category", onClick: openAdd }} />
        </div>
      ) : (
        <div className="space-y-6">
          {(filterType === "all" || filterType === "income") && income.length > 0 && <CatList cats={income} label="Income Categories" />}
          {(filterType === "all" || filterType === "expense") && expense.length > 0 && <CatList cats={expense} label="Expense Categories" />}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Category" : "New Category"} size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Name *</label>
            <input placeholder="Category name" {...register("name", { required: true })} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-blue-500" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Type</label>
            <select {...register("type")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <label key={c} className="cursor-pointer">
                  <input type="radio" {...register("color")} value={c} className="sr-only" />
                  <span className="block w-7 h-7 rounded-full" style={{ background: c }} />
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl text-sm border" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Cancel</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">{editTarget ? "Update" : "Create"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) { deleteCategory(deleteTarget.id); addToast("Category deleted"); setDeleteTarget(null) } }} title="Delete Category" message="This category will be deleted. Transactions using it will remain." confirmLabel="Delete" />
    </div>
  )
}

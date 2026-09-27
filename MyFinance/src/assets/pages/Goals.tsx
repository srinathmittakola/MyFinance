import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, PlusCircle, Target, TrendingUp } from "lucide-react"
import { useForm } from "react-hook-form"
import { useFinanceStore } from "../store/useFinanceStore"
import { useUIStore } from "../store/useUIStore"
import Modal from "../components/common/Modal"
import ConfirmDialog from "../components/common/ConfirmDialog"
import EmptyState from "../components/common/EmptyState"
import ProgressBar from "../components/common/ProgressBar"
import { formatCurrency, formatDate, getDaysRemaining, formatPercent } from "../utils/formatters"
import { calcGoalProgress } from "../utils/calculations"
import type { Goal } from "../types"
import { format } from "date-fns"

const GOAL_COLORS = ["#2563EB", "#16A34A", "#7C3AED", "#F59E0B", "#DC2626", "#0891B2", "#EC4899"]
const STATUS_CONFIG = {
  active: { label: "Active", color: "#16A34A", bg: "bg-green-100 dark:bg-green-900/30" },
  completed: { label: "Completed", color: "#2563EB", bg: "bg-blue-100 dark:bg-blue-900/30" },
  paused: { label: "Paused", color: "#F59E0B", bg: "bg-amber-100 dark:bg-amber-900/30" },
  archived: { label: "Archived", color: "#64748B", bg: "bg-gray-100 dark:bg-gray-800" },
}

export default function Goals() {
  const { goals, contributions, addGoal, updateGoal, deleteGoal, addContribution } = useFinanceStore()
  const { addToast } = useUIStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [contribModal, setContribModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Goal | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Goal | null>(null)
  const [contribTarget, setContribTarget] = useState<Goal | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | Goal["status"]>("all")

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Goal, "id" | "userId" | "createdAt" | "updatedAt">>({
    defaultValues: { status: "active", priority: "medium", color: "#2563EB", icon: "Target" },
  })
  const { register: rc, handleSubmit: hsc, reset: resetContrib } = useForm<{ amount: number; note: string; contributionDate: string }>({
    defaultValues: { contributionDate: format(new Date(), "yyyy-MM-dd") },
  })

  const openAdd = () => {
    setEditTarget(null)
    reset({ status: "active", priority: "medium", color: "#2563EB", icon: "Target", savedAmount: 0 })
    setModalOpen(true)
  }

  const openEdit = (goal: Goal) => {
    setEditTarget(goal)
    reset({ ...goal })
    setModalOpen(true)
  }

  const onSubmit = (data: any) => {
    if (editTarget) {
      updateGoal(editTarget.id, { ...data, targetAmount: Number(data.targetAmount), savedAmount: Number(data.savedAmount) })
      addToast("Goal updated successfully")
    } else {
      addGoal({ ...data, targetAmount: Number(data.targetAmount), savedAmount: Number(data.savedAmount || 0), userId: "demo-user-1" })
      addToast("Goal created successfully")
    }
    setModalOpen(false)
  }

  const onContrib = (data: { amount: number; note: string; contributionDate: string }) => {
    if (!contribTarget) return
    addContribution({ goalId: contribTarget.id, amount: Number(data.amount), note: data.note, contributionDate: data.contributionDate, userId: "demo-user-1" })
    addToast(`₹${Number(data.amount).toLocaleString()} added to ${contribTarget.name}`)
    setContribModal(false)
    resetContrib({ contributionDate: format(new Date(), "yyyy-MM-dd") })
  }

  const filtered = useMemo(() => {
    if (filterStatus === "all") return goals
    return goals.filter((g) => g.status === filterStatus)
  }, [goals, filterStatus])

  const activeGoals = goals.filter((g) => g.status === "active")
  const totalTarget = activeGoals.reduce((s, g) => s + g.targetAmount, 0)
  const totalSaved = activeGoals.reduce((s, g) => s + g.savedAmount, 0)

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          {(["all", "active", "completed", "paused", "archived"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? "bg-blue-600 text-white" : ""}`} style={filterStatus !== s ? { color: "var(--text-muted)" } : {}}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          <Plus size={15} />
          New Goal
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Goals", value: `${activeGoals.length}`, sub: "goals tracking" },
          { label: "Total Target", value: formatCurrency(totalTarget), sub: "combined target" },
          { label: "Total Saved", value: formatCurrency(totalSaved), sub: "amount saved" },
          { label: "Progress", value: formatPercent(totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0), sub: "overall completion" },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{item.label}</p>
            <p className="text-2xl font-bold nums" style={{ color: "var(--text-primary)" }}>{item.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Goals grid */}
      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={<Target size={28} />} title="No financial goals yet" description="Create your first savings goal and start working toward it." action={{ label: "Create Goal", onClick: openAdd }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((goal, i) => {
            const progress = calcGoalProgress(goal.savedAmount, goal.targetAmount)
            const daysLeft = getDaysRemaining(goal.targetDate)
            const sc = STATUS_CONFIG[goal.status]
            const goalContribs = contributions.filter((c) => c.goalId === goal.id)
            return (
              <motion.div key={goal.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: goal.color + "20" }}>🎯</div>
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{goal.name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sc.bg}`} style={{ color: sc.color }}>{sc.label}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {goal.status === "active" && (
                      <button onClick={() => { setContribTarget(goal); resetContrib({ contributionDate: format(new Date(), "yyyy-MM-dd") }); setContribModal(true) }} title="Add contribution" className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-blue-500"><PlusCircle size={15} /></button>
                    )}
                    <button onClick={() => openEdit(goal)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" style={{ color: "var(--text-muted)" }}><Edit2 size={14} /></button>
                    <button onClick={() => setDeleteTarget(goal)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>

                {goal.description && <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--text-muted)" }}>{goal.description}</p>}

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-muted)" }}>Progress</span>
                    <span className="font-bold nums" style={{ color: goal.color }}>{progress.toFixed(1)}%</span>
                  </div>
                  <ProgressBar value={progress} color={goal.color} height={8} />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 rounded-lg" style={{ background: "var(--bg-page)" }}>
                      <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Saved</p>
                      <p className="font-bold nums text-green-600">{formatCurrency(goal.savedAmount)}</p>
                    </div>
                    <div className="p-2 rounded-lg" style={{ background: "var(--bg-page)" }}>
                      <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Target</p>
                      <p className="font-bold nums" style={{ color: "var(--text-primary)" }}>{formatCurrency(goal.targetAmount)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                    <span>Target: {formatDate(goal.targetDate)}</span>
                    <span style={{ color: daysLeft <= 30 ? "#F59E0B" : "var(--text-muted)" }}>
                      {daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? "Due today" : "Overdue"}
                    </span>
                  </div>
                  {goalContribs.length > 0 && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{goalContribs.length} contribution{goalContribs.length !== 1 ? "s" : ""}</p>}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Goal Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Goal" : "Create Goal"} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Goal Name *</label>
              <input placeholder="Emergency Fund" {...register("name", { required: true })} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-blue-500" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Target Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-muted)" }}>₹</span>
                <input type="number" min="1" placeholder="100000" {...register("targetAmount", { required: true, min: 1 })} className="w-full pl-8 pr-3 py-2.5 rounded-xl border text-sm outline-none focus:border-blue-500" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Initial Saved Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-muted)" }}>₹</span>
                <input type="number" min="0" placeholder="0" {...register("savedAmount")} className="w-full pl-8 pr-3 py-2.5 rounded-xl border text-sm outline-none focus:border-blue-500" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Target Date *</label>
              <input type="date" {...register("targetDate", { required: true })} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Priority</label>
              <select {...register("priority")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Status</label>
              <select {...register("status")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Color</label>
              <div className="flex gap-2 flex-wrap">
                {GOAL_COLORS.map((c) => (
                  <label key={c} className="cursor-pointer">
                    <input type="radio" {...register("color")} value={c} className="sr-only" />
                    <span className="block w-7 h-7 rounded-full border-2 border-transparent" style={{ background: c }} />
                  </label>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Description</label>
              <textarea rows={2} placeholder="What are you saving for?" {...register("description")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl text-sm border" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Cancel</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">{editTarget ? "Update" : "Create"} Goal</button>
          </div>
        </form>
      </Modal>

      {/* Contribution Modal */}
      <Modal open={contribModal} onClose={() => setContribModal(false)} title={`Add to ${contribTarget?.name}`} size="sm">
        <form onSubmit={hsc(onContrib)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Amount *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-muted)" }}>₹</span>
              <input type="number" min="1" placeholder="10000" {...rc("amount", { required: true, min: 1 })} className="w-full pl-8 pr-3 py-2.5 rounded-xl border text-sm outline-none focus:border-blue-500" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Date</label>
            <input type="date" {...rc("contributionDate")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Note</label>
            <input placeholder="Monthly savings" {...rc("note")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setContribModal(false)} className="px-4 py-2.5 rounded-xl text-sm border" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Cancel</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">Add Contribution</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) { deleteGoal(deleteTarget.id); addToast("Goal deleted"); setDeleteTarget(null) } }} title="Delete Goal" message="This goal and all its data will be permanently removed." confirmLabel="Delete" />
    </div>
  )
}

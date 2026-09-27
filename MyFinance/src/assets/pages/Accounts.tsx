import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, CreditCard, Banknote, Wallet, TrendingUp } from "lucide-react"
import { useForm } from "react-hook-form"
import { useFinanceStore } from "../store/useFinanceStore"
import { useUIStore } from "../store/useUIStore"
import Modal from "../components/common/Modal"
import ConfirmDialog from "../components/common/ConfirmDialog"
import EmptyState from "../components/common/EmptyState"
import { formatCurrency } from "../utils/formatters"
import { calcAccountBalance } from "../utils/calculations"
import type { Account } from "../types"
import { ACCOUNT_TYPES } from "../constants/data"

const ACCOUNT_ICONS: Record<string, React.FC<any>> = {
  bank: Banknote, savings: Banknote, cash: Wallet, credit_card: CreditCard,
  wallet: Wallet, investment: TrendingUp, other: CreditCard,
}

const ACCOUNT_COLORS: Record<string, string> = {
  bank: "#2563EB", savings: "#16A34A", cash: "#F59E0B",
  credit_card: "#DC2626", wallet: "#7C3AED", investment: "#0891B2", other: "#64748B",
}

export default function Accounts() {
  const { accounts, transactions, addAccount, updateAccount, deleteAccount } = useFinanceStore()
  const { addToast } = useUIStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Account | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null)

  const { register, handleSubmit, reset } = useForm<Omit<Account, "id" | "userId" | "createdAt" | "updatedAt">>({
    defaultValues: { type: "bank", currency: "INR", openingBalance: 0, currentBalance: 0 },
  })

  const openAdd = () => {
    setEditTarget(null)
    reset({ type: "bank", currency: "INR", openingBalance: 0, currentBalance: 0 })
    setModalOpen(true)
  }

  const openEdit = (acc: Account) => {
    setEditTarget(acc)
    reset({ ...acc })
    setModalOpen(true)
  }

  const onSubmit = (data: any) => {
    const payload = { ...data, openingBalance: Number(data.openingBalance), currentBalance: Number(data.currentBalance) }
    if (editTarget) {
      updateAccount(editTarget.id, payload)
      addToast("Account updated")
    } else {
      addAccount({ ...payload, userId: "demo-user-1" })
      addToast("Account added")
    }
    setModalOpen(false)
  }

  const totalBalance = accounts.reduce((s, a) => s + a.currentBalance, 0)
  const totalAssets = accounts.filter((a) => a.currentBalance > 0).reduce((s, a) => s + a.currentBalance, 0)
  const totalLiabilities = accounts.filter((a) => a.currentBalance < 0).reduce((s, a) => s + Math.abs(a.currentBalance), 0)

  return (
    <div className="p-6 space-y-5 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{accounts.length} accounts</p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          <Plus size={15} />
          Add Account
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Balance", value: formatCurrency(totalBalance), color: totalBalance >= 0 ? "#2563EB" : "#DC2626" },
          { label: "Total Assets", value: formatCurrency(totalAssets), color: "#16A34A" },
          { label: "Total Liabilities", value: formatCurrency(totalLiabilities), color: "#DC2626" },
        ].map((item) => (
          <div key={item.label} className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{item.label}</p>
            <p className="text-2xl font-bold nums" style={{ color: item.color }}>{item.value}</p>
          </div>
        ))}
      </div>

      {accounts.length === 0 ? (
        <div className="card">
          <EmptyState icon={<CreditCard size={28} />} title="No accounts yet" description="Add your bank accounts, cash, and other financial accounts." action={{ label: "Add Account", onClick: openAdd }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts.map((acc, i) => {
            const Icon = ACCOUNT_ICONS[acc.type] || CreditCard
            const color = ACCOUNT_COLORS[acc.type] || "#64748B"
            const txCount = transactions.filter((t) => t.accountId === acc.id).length
            const incomeThisAcc = transactions.filter((t) => t.accountId === acc.id && t.type === "income").reduce((s, t) => s + t.amount, 0)
            const expenseThisAcc = transactions.filter((t) => t.accountId === acc.id && t.type === "expense").reduce((s, t) => s + t.amount, 0)
            return (
              <motion.div key={acc.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: color + "20" }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{acc.name}</h3>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {ACCOUNT_TYPES.find((t) => t.value === acc.type)?.label || acc.type}
                        {acc.maskedNumber && ` · ${acc.maskedNumber}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(acc)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" style={{ color: "var(--text-muted)" }}><Edit2 size={14} /></button>
                    <button onClick={() => setDeleteTarget(acc)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Current Balance</p>
                  <p className={`text-2xl font-bold nums ${acc.currentBalance < 0 ? "text-red-500" : ""}`} style={acc.currentBalance >= 0 ? { color: "var(--text-primary)" } : {}}>
                    {acc.currentBalance < 0 ? "-" : ""}{formatCurrency(Math.abs(acc.currentBalance), acc.currency)}
                  </p>
                </div>

                {acc.bankName && <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{acc.bankName}</p>}

                <div className="grid grid-cols-3 gap-2 pt-3 border-t" style={{ borderColor: "var(--border-color)" }}>
                  <div>
                    <p className="text-[10px] uppercase font-semibold mb-0.5" style={{ color: "var(--text-muted)" }}>Tx</p>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{txCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-semibold mb-0.5 text-green-600">Income</p>
                    <p className="text-sm font-semibold nums text-green-600">{formatCurrency(incomeThisAcc, acc.currency).replace(/[₹$€£]/, "").trim()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-semibold mb-0.5 text-red-500">Spent</p>
                    <p className="text-sm font-semibold nums text-red-500">{formatCurrency(expenseThisAcc, acc.currency).replace(/[₹$€£]/, "").trim()}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Account" : "Add Account"} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Account Name *</label>
              <input placeholder="SBI Savings" {...register("name", { required: true })} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-blue-500" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Account Type</label>
              <select {...register("type")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                {ACCOUNT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Currency</label>
              <select {...register("currency")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                {["INR", "USD", "EUR", "GBP", "AED"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Opening Balance</label>
              <input type="number" placeholder="0" {...register("openingBalance")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Current Balance</label>
              <input type="number" placeholder="0" {...register("currentBalance")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Bank Name</label>
              <input placeholder="State Bank of India" {...register("bankName")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Account Number (masked)</label>
              <input placeholder="xxxx 4821" {...register("maskedNumber")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Description</label>
              <input placeholder="Optional note" {...register("description")} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl text-sm border" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Cancel</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">{editTarget ? "Update" : "Add"} Account</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) { deleteAccount(deleteTarget.id); addToast("Account deleted"); setDeleteTarget(null) } }} title="Delete Account" message="This account will be permanently deleted." confirmLabel="Delete" />
    </div>
  )
}

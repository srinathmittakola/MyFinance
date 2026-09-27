import { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { useUIStore } from "../../store/useUIStore"
import { useFinanceStore } from "../../store/useFinanceStore"
import { format } from "date-fns"

interface FormData {
  type: "income" | "expense"
  amount: number
  categoryId: string
  accountId: string
  description: string
  transactionDate: string
}

export default function QuickAdd() {
  const { setQuickAdd, addToast } = useUIStore()
  const { addTransaction, categories, accounts } = useFinanceStore()
  const [type, setType] = useState<"income" | "expense">("expense")

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      type: "expense",
      transactionDate: format(new Date(), "yyyy-MM-dd"),
    },
  })

  const incomeCategories = categories.filter((c) => c.type === "income" || c.type === "both")
  const expenseCategories = categories.filter((c) => c.type === "expense" || c.type === "both")

  const onSubmit = (data: FormData) => {
    addTransaction({
      ...data,
      type,
      amount: Number(data.amount),
      userId: "demo-user-1",
      isRecurring: false,
    })
    addToast(`${type === "income" ? "Income" : "Expense"} added successfully`)
    setQuickAdd(false)
  }

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={() => setQuickAdd(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
          <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Quick Add Transaction</h2>
          <button onClick={() => setQuickAdd(false)} style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Type Toggle */}
          <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "var(--border-color)" }}>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${type === "expense" ? "bg-red-500 text-white" : ""}`}
              style={type !== "expense" ? { color: "var(--text-secondary)" } : {}}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${type === "income" ? "bg-green-500 text-white" : ""}`}
              style={type !== "income" ? { color: "var(--text-secondary)" } : {}}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold" style={{ color: "var(--text-muted)" }}>₹</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                {...register("amount", { required: "Amount is required", min: { value: 0.01, message: "Amount must be positive" } })}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm border outline-none transition-colors focus:border-blue-500"
                style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              />
            </div>
            {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Category</label>
            <select
              {...register("categoryId", { required: "Category is required" })}
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
              style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
            >
              <option value="">Select category</option>
              {(type === "income" ? incomeCategories : expenseCategories).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Account</label>
            <select
              {...register("accountId", { required: "Account is required" })}
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
              style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
            >
              <option value="">Select account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Description</label>
            <input
              type="text"
              placeholder="What's this for?"
              {...register("description", { required: "Description is required" })}
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
              style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Date</label>
            <input
              type="date"
              {...register("transactionDate", { required: true })}
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
              style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
            style={{ background: type === "income" ? "#16A34A" : "#DC2626" }}
          >
            Add {type === "income" ? "Income" : "Expense"}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

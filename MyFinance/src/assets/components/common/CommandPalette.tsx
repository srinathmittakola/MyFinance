import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, LayoutDashboard, ArrowLeftRight, Target, PieChart, CreditCard, BarChart3, Tag, Settings, User } from "lucide-react"
import { useUIStore } from "../../store/useUIStore"
import { useFinanceStore } from "../../store/useFinanceStore"

const PAGES = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { label: "Goals", path: "/goals", icon: Target },
  { label: "Budgets", path: "/budgets", icon: PieChart },
  { label: "Accounts", path: "/accounts", icon: CreditCard },
  { label: "Reports", path: "/reports", icon: BarChart3 },
  { label: "Categories", path: "/categories", icon: Tag },
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "Profile", path: "/profile", icon: User },
]

export default function CommandPalette() {
  const [query, setQuery] = useState("")
  const { setCommandPalette } = useUIStore()
  const { transactions, goals, accounts } = useFinanceStore()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCommandPalette(false)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [setCommandPalette])

  const q = query.toLowerCase()
  const filteredPages = PAGES.filter((p) => p.label.toLowerCase().includes(q))
  const filteredTx = q.length >= 2 ? transactions.filter((t) => t.description.toLowerCase().includes(q)).slice(0, 3) : []
  const filteredGoals = q.length >= 2 ? goals.filter((g) => g.name.toLowerCase().includes(q)).slice(0, 3) : []
  const filteredAccounts = q.length >= 2 ? accounts.filter((a) => a.name.toLowerCase().includes(q)).slice(0, 3) : []

  const go = (path: string) => {
    navigate(path)
    setCommandPalette(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={() => setCommandPalette(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -12 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--border-color)" }}>
          <Search size={18} style={{ color: "var(--text-muted)" }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, transactions, goals..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          <button onClick={() => setCommandPalette(false)} style={{ color: "var(--text-muted)" }}>
            <X size={16} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto py-2">
          {filteredPages.length > 0 && (
            <div>
              <p className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Pages</p>
              {filteredPages.map((p) => (
                <button
                  key={p.path}
                  onClick={() => go(p.path)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-white/10"
                  style={{ color: "var(--text-primary)" }}
                >
                  <p.icon size={16} style={{ color: "var(--text-muted)" }} />
                  {p.label}
                </button>
              ))}
            </div>
          )}
          {filteredTx.length > 0 && (
            <div>
              <p className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Transactions</p>
              {filteredTx.map((t) => (
                <button
                  key={t.id}
                  onClick={() => go("/transactions")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-white/10"
                  style={{ color: "var(--text-primary)" }}
                >
                  <ArrowLeftRight size={16} style={{ color: "var(--text-muted)" }} />
                  <span className="flex-1 text-left">{t.description}</span>
                  <span className={`text-xs font-semibold ${t.type === "income" ? "text-green-500" : "text-red-500"}`}>
                    {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          )}
          {filteredGoals.length > 0 && (
            <div>
              <p className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Goals</p>
              {filteredGoals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => go("/goals")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-white/10"
                  style={{ color: "var(--text-primary)" }}
                >
                  <Target size={16} style={{ color: "var(--text-muted)" }} />
                  {g.name}
                </button>
              ))}
            </div>
          )}
          {filteredAccounts.length > 0 && (
            <div>
              <p className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Accounts</p>
              {filteredAccounts.map((a) => (
                <button
                  key={a.id}
                  onClick={() => go("/accounts")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-white/10"
                  style={{ color: "var(--text-primary)" }}
                >
                  <CreditCard size={16} style={{ color: "var(--text-muted)" }} />
                  {a.name}
                </button>
              ))}
            </div>
          )}
          {query.length >= 2 && filteredPages.length === 0 && filteredTx.length === 0 && filteredGoals.length === 0 && filteredAccounts.length === 0 && (
            <p className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>No results for "{query}"</p>
          )}
          {query.length === 0 && (
            <p className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>Start typing to search...</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

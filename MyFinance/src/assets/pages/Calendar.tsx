import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, addMonths, subMonths } from "date-fns"
import { useFinanceStore } from "../store/useFinanceStore"
import { formatCurrency } from "../utils/formatters"

export default function Calendar() {
  const [current, setCurrent] = useState(new Date())
  const [selected, setSelected] = useState<Date | null>(null)
  const { transactions, categories } = useFinanceStore()

  const start = startOfMonth(current)
  const end = endOfMonth(current)
  const days = eachDayOfInterval({ start, end })
  const startDay = getDay(start)

  const getDayTx = (day: Date) =>
    transactions.filter((t) => isSameDay(new Date(t.transactionDate), day))

  const selectedTx = selected ? getDayTx(selected) : []

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="p-6 max-w-[1000px] mx-auto space-y-4">
      <div className="card p-5">
        {/* Calendar header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>{format(current, "MMMM yyyy")}</h2>
          <div className="flex gap-2">
            <button onClick={() => setCurrent(subMonths(current, 1))} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" style={{ color: "var(--text-muted)" }}><ChevronLeft size={16} /></button>
            <button onClick={() => setCurrent(new Date())} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600">Today</button>
            <button onClick={() => setCurrent(addMonths(current, 1))} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" style={{ color: "var(--text-muted)" }}><ChevronRight size={16} /></button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-xs font-semibold py-2" style={{ color: "var(--text-muted)" }}>{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {days.map((day) => {
            const dayTx = getDayTx(day)
            const isToday = isSameDay(day, new Date())
            const isSelected = selected && isSameDay(day, selected)
            const income = dayTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
            const expense = dayTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelected(isSelected ? null : day)}
                className={`min-h-[72px] p-2 rounded-xl text-left transition-all hover:shadow-sm ${isSelected ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : isToday ? "ring-1 ring-blue-300 bg-blue-50/50 dark:bg-blue-900/10" : "hover:bg-gray-50 dark:hover:bg-white/5"}`}
                style={{ border: "1px solid var(--border-color)" }}
              >
                <p className={`text-sm font-semibold mb-1 ${isToday ? "text-blue-600" : ""}`} style={!isToday ? { color: "var(--text-secondary)" } : {}}>
                  {format(day, "d")}
                </p>
                {income > 0 && <p className="text-[10px] font-semibold text-green-600 truncate">+{formatCurrency(income).replace("₹", "₹")}</p>}
                {expense > 0 && <p className="text-[10px] font-semibold text-red-500 truncate">-{formatCurrency(expense)}</p>}
                {dayTx.length > 0 && <div className="flex gap-0.5 mt-1 flex-wrap">{dayTx.slice(0, 3).map((_, i) => <span key={i} className="w-1 h-1 rounded-full bg-blue-400" />)}</div>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day details */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>
            {format(selected, "EEEE, MMMM d, yyyy")}
          </h3>
          {selectedTx.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No transactions on this day.</p>
          ) : (
            <div className="space-y-3">
              {selectedTx.map((tx) => {
                const cat = categories.find((c) => c.id === tx.categoryId)
                return (
                  <div key={tx.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: (cat?.color || "#64748B") + "20" }}>
                      <span className="text-sm">{tx.type === "income" ? "💰" : "💸"}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{tx.description}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{cat?.name}</p>
                    </div>
                    <span className={`text-sm font-bold nums ${tx.type === "income" ? "text-green-600" : "text-red-500"}`}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

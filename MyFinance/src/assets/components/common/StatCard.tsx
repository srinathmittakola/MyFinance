import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  iconBg: string
  index?: number
  onClick?: () => void
}

export default function StatCard({ title, value, change, changeLabel, icon, iconBg, index = 0, onClick }: StatCardProps) {
  const isPositive = (change ?? 0) >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      whileHover={{ y: -2, scale: 1.01 }}
      onClick={onClick}
      className={`card p-5 ${onClick ? "cursor-pointer" : ""} transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
        {title}
      </p>
      <p className="text-2xl font-bold nums" style={{ color: "var(--text-primary)" }}>
        {value}
      </p>
      {changeLabel && (
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          {changeLabel}
        </p>
      )}
    </motion.div>
  )
}

import { motion } from "framer-motion"
import { Bell, CheckCheck, Trash2, Info, AlertTriangle, Target, DollarSign, RefreshCw } from "lucide-react"
import { useFinanceStore } from "../store/useFinanceStore"
import { useUIStore } from "../store/useUIStore"
import { formatDate } from "../utils/formatters"
import EmptyState from "../components/common/EmptyState"
import type { Notification } from "../types"

const TYPE_CONFIG: Record<Notification["type"], { icon: React.FC<any>; color: string; bg: string }> = {
  budget_exceeded: { icon: AlertTriangle, color: "#DC2626", bg: "bg-red-100 dark:bg-red-900/30" },
  budget_warning: { icon: AlertTriangle, color: "#F59E0B", bg: "bg-amber-100 dark:bg-amber-900/30" },
  upcoming_bill: { icon: RefreshCw, color: "#7C3AED", bg: "bg-purple-100 dark:bg-purple-900/30" },
  goal_deadline: { icon: Target, color: "#2563EB", bg: "bg-blue-100 dark:bg-blue-900/30" },
  goal_completed: { icon: Target, color: "#16A34A", bg: "bg-green-100 dark:bg-green-900/30" },
  recurring_due: { icon: RefreshCw, color: "#0891B2", bg: "bg-teal-100 dark:bg-teal-900/30" },
  large_expense: { icon: DollarSign, color: "#DC2626", bg: "bg-red-100 dark:bg-red-900/30" },
  monthly_summary: { icon: Info, color: "#2563EB", bg: "bg-blue-100 dark:bg-blue-900/30" },
  info: { icon: Info, color: "#64748B", bg: "bg-gray-100 dark:bg-gray-800" },
}

export default function Notifications() {
  const { notifications, markNotificationRead, markAllRead, deleteNotification } = useFinanceStore()
  const { addToast } = useUIStore()

  const unread = notifications.filter((n) => !n.isRead).length
  const sorted = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleMarkAll = () => {
    markAllRead()
    addToast("All notifications marked as read")
  }

  return (
    <div className="p-6 max-w-[800px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {unread > 0 ? `${unread} unread notification${unread !== 1 ? "s" : ""}` : "All caught up!"}
        </p>
        {unread > 0 && (
          <button onClick={handleMarkAll} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <CheckCheck size={15} />
            Mark all as read
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="card">
          <EmptyState icon={<Bell size={28} />} title="No notifications" description="You're all caught up! Notifications will appear here." />
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((notif, i) => {
            const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info
            const Icon = config.icon
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => !notif.isRead && markNotificationRead(notif.id)}
                className={`card p-4 flex items-start gap-4 cursor-pointer transition-all hover:shadow-md ${!notif.isRead ? "border-l-4 border-l-blue-500" : ""}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
                  <Icon size={17} style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${!notif.isRead ? "font-semibold" : ""}`} style={{ color: "var(--text-primary)" }}>
                      {notif.title}
                      {!notif.isRead && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-blue-600 inline-block align-middle" />}
                    </p>
                    <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>{formatDate(notif.createdAt, "dd MMM")}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{notif.message}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id) }}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-400 shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

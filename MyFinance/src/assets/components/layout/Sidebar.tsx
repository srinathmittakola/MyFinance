import { NavLink, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, ArrowLeftRight, TrendingUp, TrendingDown, Target,
  PieChart, CreditCard, RefreshCw, BarChart3, Calendar, Tag, Bell,
  Settings, User, LogOut, ChevronLeft, ChevronRight, DollarSign,
} from "lucide-react"
import { useUIStore } from "../../store/useUIStore"
import { useAuthStore } from "../../store/useAuthStore"
import { useFinanceStore } from "../../store/useFinanceStore"

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  LayoutDashboard, ArrowLeftRight, TrendingUp, TrendingDown, Target,
  PieChart, CreditCard, RefreshCw, BarChart3, Calendar, Tag, Bell,
  Settings, User,
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
  { id: "transactions", label: "Transactions", path: "/transactions", icon: "ArrowLeftRight" },
  { id: "income", label: "Income", path: "/income", icon: "TrendingUp" },
  { id: "expenses", label: "Expenses", path: "/expenses", icon: "TrendingDown" },
  { id: "goals", label: "Goals", path: "/goals", icon: "Target" },
  { id: "budgets", label: "Budgets", path: "/budgets", icon: "PieChart" },
  { id: "accounts", label: "Accounts", path: "/accounts", icon: "CreditCard" },
  { id: "recurring", label: "Recurring", path: "/recurring", icon: "RefreshCw" },
  { id: "reports", label: "Reports", path: "/reports", icon: "BarChart3" },
]

const SECONDARY_NAV = [
  { id: "calendar", label: "Calendar", path: "/calendar", icon: "Calendar" },
  { id: "categories", label: "Categories", path: "/categories", icon: "Tag" },
  { id: "notifications", label: "Notifications", path: "/notifications", icon: "Bell" },
  { id: "settings", label: "Settings", path: "/settings", icon: "Settings" },
  { id: "profile", label: "Profile", path: "/profile", icon: "User" },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()
  const { notifications } = useFinanceStore()
  const navigate = useNavigate()
  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 68 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="h-screen flex flex-col shrink-0 overflow-hidden"
      style={{ background: "var(--bg-sidebar)" }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 shrink-0 border-b border-white/10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
            <DollarSign size={16} className="text-white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-white tracking-widest text-sm whitespace-nowrap overflow-hidden"
              >
                FINANCE OS
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={toggleSidebar}
          className="ml-auto text-white/50 hover:text-white transition-colors shrink-0 p-1 rounded"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon]
          return (
            <NavLink
              key={item.id}
              to={item.path}
              title={sidebarCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium relative ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-full"
                    />
                  )}
                  {Icon && <Icon size={18} className="shrink-0" />}
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          )
        })}

        {/* Divider */}
        <div className="my-3 border-t border-white/10" />

        {/* Secondary nav */}
        {SECONDARY_NAV.map((item) => {
          const Icon = ICON_MAP[item.icon]
          const isNotif = item.id === "notifications"
          return (
            <NavLink
              key={item.id}
              to={item.path}
              title={sidebarCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {Icon && (
                <span className="relative shrink-0">
                  <Icon size={18} />
                  {isNotif && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center leading-none px-0.5">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </span>
              )}
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="shrink-0 border-t border-white/10 p-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.fullName?.[0] || "U"}
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-white text-xs font-semibold truncate">{user?.fullName}</p>
                <p className="text-white/40 text-[11px] truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-white/40 hover:text-red-400 transition-colors shrink-0 p-1 rounded"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </motion.aside>
  )
}

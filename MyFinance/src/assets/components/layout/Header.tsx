import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Search, Bell, Sun, Moon, Monitor, ChevronDown, User, Settings, LogOut, Command } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useUIStore } from "../../store/useUIStore"
import { useAuthStore } from "../../store/useAuthStore"
import { useFinanceStore } from "../../store/useFinanceStore"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/income": "Income",
  "/expenses": "Expenses",
  "/goals": "Goals",
  "/budgets": "Budgets",
  "/accounts": "Accounts",
  "/recurring": "Recurring Transactions",
  "/reports": "Reports",
  "/calendar": "Calendar",
  "/categories": "Categories",
  "/notifications": "Notifications",
  "/settings": "Settings",
  "/profile": "Profile",
}

export default function Header() {
  const { theme, setTheme, setCommandPalette } = useUIStore()
  const { user, logout } = useAuthStore()
  const { notifications } = useFinanceStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const themeMenuRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const pageTitle = PAGE_TITLES[location.pathname] || "Finance OS"

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setCommandPalette(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [setCommandPalette])

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor

  return (
    <header
      className="h-16 flex items-center gap-4 px-6 border-b shrink-0"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
    >
      <h1 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
        {pageTitle}
      </h1>

      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <button
          onClick={() => setCommandPalette(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border"
          style={{
            background: "var(--bg-page)",
            borderColor: "var(--border-color)",
            color: "var(--text-muted)",
          }}
          title="Search (Ctrl+K)"
        >
          <Search size={15} />
          <span className="hidden sm:block">Search...</span>
          <kbd className="hidden sm:flex items-center gap-0.5 text-[11px] opacity-60 border rounded px-1" style={{ borderColor: "var(--border-color)" }}>
            <Command size={10} />K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
          title="Notifications"
        >
          <Bell size={18} style={{ color: "var(--text-secondary)" }} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        {/* Theme toggle */}
        <div className="relative" ref={themeMenuRef}>
          <button
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <ThemeIcon size={18} style={{ color: "var(--text-secondary)" }} />
          </button>
          <AnimatePresence>
            {themeMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 rounded-xl shadow-xl border overflow-hidden z-50 min-w-[140px]"
                style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
              >
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTheme(t); setThemeMenuOpen(false) }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                      theme === t ? "text-blue-600" : ""
                    } hover:bg-gray-100 dark:hover:bg-white/10`}
                    style={{ color: theme === t ? "#2563EB" : "var(--text-secondary)" }}
                  >
                    {t === "light" ? <Sun size={15} /> : t === "dark" ? <Moon size={15} /> : <Monitor size={15} />}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.fullName?.[0] || "U"}
            </div>
            <span className="text-sm font-medium hidden sm:block" style={{ color: "var(--text-primary)" }}>
              {user?.fullName?.split(" ")[0]}
            </span>
            <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
          </button>
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 rounded-xl shadow-xl border overflow-hidden z-50 min-w-[180px]"
                style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
              >
                <div className="px-3 py-2.5 border-b" style={{ borderColor: "var(--border-color)" }}>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{user?.fullName}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
                </div>
                {[
                  { label: "Profile", icon: User, path: "/profile" },
                  { label: "Settings", icon: Settings, path: "/settings" },
                ].map(({ label, icon: Icon, path }) => (
                  <button
                    key={label}
                    onClick={() => { navigate(path); setUserMenuOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
                <div className="border-t" style={{ borderColor: "var(--border-color)" }} />
                <button
                  onClick={() => { logout(); navigate("/login") }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

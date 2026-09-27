import { useEffect } from "react"
import { Outlet, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { useAuthStore } from "../../store/useAuthStore"
import { useUIStore } from "../../store/useUIStore"
import { useFinanceStore } from "../../store/useFinanceStore"
import { useLockStore } from "../../store/useLockStore"
import CommandPalette from "../common/CommandPalette"
import QuickAdd from "../common/QuickAdd"
import LockScreen from "../common/LockScreen"

const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const TOAST_COLORS = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-blue-500",
  warning: "text-amber-500",
}

export default function AppShell() {
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()
  const { theme, toasts, removeToast, commandPaletteOpen, quickAddOpen } = useUIStore()
  const { initialized, initSeedData } = useFinanceStore()
  const { isLocked, lockEnabled, pinHash, lock } = useLockStore()

  useEffect(() => {
    if (!initialized) initSeedData()
  }, [initialized, initSeedData])

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      document.documentElement.classList.toggle("dark", prefersDark)
    }
  }, [theme])

  // Lock when user closes tab or browser
  useEffect(() => {
    if (!lockEnabled || !pinHash) return
    const handleUnload = () => lock()
    window.addEventListener("beforeunload", handleUnload)
    return () => window.removeEventListener("beforeunload", handleUnload)
  }, [lockEnabled, pinHash, lock])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-page)" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = TOAST_ICONS[toast.type]
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 80, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-auto flex items-start gap-3 pl-4 pr-3 py-3 rounded-xl shadow-2xl border max-w-sm"
                style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
              >
                <Icon size={18} className={`shrink-0 mt-0.5 ${TOAST_COLORS[toast.type]}`} />
                <p className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>
                  {toast.message}
                </p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 p-0.5 rounded hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={14} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {commandPaletteOpen && <CommandPalette />}
      {quickAddOpen && <QuickAdd />}

      {/* Lock screen overlay */}
      <AnimatePresence>
        {isLocked && <LockScreen />}
      </AnimatePresence>
    </div>
  )
}

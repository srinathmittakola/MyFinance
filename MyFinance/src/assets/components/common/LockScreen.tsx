import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Delete, LogOut, Eye, EyeOff } from "lucide-react"
import { useLockStore } from "../../store/useLockStore"
import { useAuthStore } from "../../store/useAuthStore"
import { useNavigate } from "react-router-dom"

const MAX_ATTEMPTS = 5

export default function LockScreen() {
  const { verifyPin, unlock, removePin } = useLockStore()
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  const [pin, setPin] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [shake, setShake] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [locked, setLocked] = useState(false) // locked out after max attempts
  const [lockoutSeconds, setLockoutSeconds] = useState(0)
  const [showForgot, setShowForgot] = useState(false)

  // Lockout countdown
  useEffect(() => {
    if (!locked) return
    setLockoutSeconds(30)
    const interval = setInterval(() => {
      setLockoutSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval)
          setLocked(false)
          setAttempts(0)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [locked])

  const triggerShake = useCallback(() => {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }, [])

  const handleDigit = useCallback((d: string) => {
    if (locked || pin.length >= 6) return
    const next = pin + d
    setPin(next)
    if (next.length === 6) {
      setTimeout(() => {
        if (verifyPin(next)) {
          unlock()
        } else {
          triggerShake()
          setPin("")
          const newAttempts = attempts + 1
          setAttempts(newAttempts)
          if (newAttempts >= MAX_ATTEMPTS) setLocked(true)
        }
      }, 120)
    }
  }, [locked, pin, attempts, verifyPin, unlock, triggerShake])

  const handleDelete = useCallback(() => {
    setPin((p) => p.slice(0, -1))
  }, [])

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key)
      else if (e.key === "Backspace") handleDelete()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handleDigit, handleDelete])

  const handleLogout = () => {
    removePin()
    logout()
    navigate("/login", { replace: true })
  }

  const DIGITS = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "⌫"],
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: "var(--bg-page)" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #2563EB, transparent)" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-xs px-6">
        {/* Lock icon */}
        <motion.div
          animate={shake ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-600/30"
        >
          <Lock size={28} className="text-white" />
        </motion.div>

        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          App Locked
        </h2>
        <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
          {user?.fullName?.split(" ")[0] || "User"}'s Finance OS
        </p>
        <p className="text-xs mb-8" style={{ color: "var(--text-muted)" }}>
          Enter your PIN to continue
        </p>

        {/* PIN dots */}
        <div className="flex gap-3 mb-2">
          {Array.from({ length: 6 }).map((_, i) => {
            const filled = i < pin.length
            return (
              <motion.div
                key={i}
                animate={filled ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.15 }}
                className="w-3.5 h-3.5 rounded-full border-2 transition-colors"
                style={{
                  background: filled ? "#2563EB" : "transparent",
                  borderColor: filled ? "#2563EB" : "var(--border-color)",
                }}
              />
            )
          })}
        </div>

        {/* Show/hide PIN toggle */}
        <button
          onClick={() => setShowPin((v) => !v)}
          className="flex items-center gap-1.5 text-xs mb-6 transition-opacity hover:opacity-70"
          style={{ color: "var(--text-muted)" }}
        >
          {showPin ? <EyeOff size={13} /> : <Eye size={13} />}
          {showPin ? "Hide" : "Show"} PIN
        </button>

        {/* Show typed PIN if visible */}
        {showPin && pin.length > 0 && (
          <p className="text-2xl font-mono tracking-[0.5em] mb-4 font-bold" style={{ color: "var(--text-primary)" }}>
            {pin}
          </p>
        )}

        {/* Error / lockout message */}
        <AnimatePresence mode="wait">
          {locked ? (
            <motion.p
              key="lockout"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-red-500 mb-4 text-center font-medium"
            >
              Too many attempts. Try again in {lockoutSeconds}s
            </motion.p>
          ) : attempts > 0 ? (
            <motion.p
              key="attempts"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-red-500 mb-4 text-center"
            >
              Incorrect PIN · {MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts !== 1 ? "s" : ""} remaining
            </motion.p>
          ) : (
            <div key="spacer" className="h-5 mb-4" />
          )}
        </AnimatePresence>

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          {DIGITS.flat().map((d, i) => {
            if (d === "") return <div key={i} />
            if (d === "⌫") {
              return (
                <button
                  key={i}
                  onClick={handleDelete}
                  disabled={locked}
                  className="h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-30"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
                >
                  <Delete size={18} style={{ color: "var(--text-secondary)" }} />
                </button>
              )
            }
            return (
              <button
                key={i}
                onClick={() => handleDigit(d)}
                disabled={locked}
                className="h-14 rounded-2xl text-xl font-semibold transition-all active:scale-95 hover:border-blue-400 disabled:opacity-30"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              >
                {d}
              </button>
            )
          })}
        </div>

        {/* Forgot PIN */}
        <button
          onClick={() => setShowForgot(true)}
          className="text-xs text-blue-600 hover:text-blue-700 mb-4 font-medium"
        >
          Forgot PIN?
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-red-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={13} />
          Sign out instead
        </button>
      </div>

      {/* Forgot PIN modal */}
      <AnimatePresence>
        {showForgot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
            >
              <h3 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>
                Forgot your PIN?
              </h3>
              <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
                You'll be signed out and the PIN will be removed. You can set a new PIN after logging back in.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForgot(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Sign Out & Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

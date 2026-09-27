import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Monitor, Bell, Shield, Database, Lock, Check, X, Eye, EyeOff, LogOut } from "lucide-react"
import { useUIStore } from "../store/useUIStore"
import { useAuthStore } from "../store/useAuthStore"
import { useLockStore } from "../store/useLockStore"
import { CURRENCIES } from "../constants/data"

function PinInput({ value, onChange, placeholder = "Enter PIN" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        inputMode="numeric"
        maxLength={6}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 tracking-[0.4em] font-mono"
        style={{ background: "var(--bg-page)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        style={{ color: "var(--text-muted)" }}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

type PinModal = "set" | "change" | "remove" | null

export default function Settings() {
  const { theme, setTheme, currency, setCurrency } = useUIStore()
  const { user, updateUser, logout } = useAuthStore()
  const {
    lockEnabled, pinHash,
    setLockEnabled, setPin, removePin, verifyPin, lock,
  } = useLockStore()
  const { addToast } = useUIStore()

  // PIN modal state
  const [pinModal, setPinModal] = useState<PinModal>(null)
  const [currentPin, setCurrentPin] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [pinError, setPinError] = useState("")
  const [pinSuccess, setPinSuccess] = useState(false)

  const resetPinModal = () => {
    setCurrentPin(""); setNewPin(""); setConfirmPin(""); setPinError(""); setPinSuccess(false)
  }

  const closePinModal = () => { setPinModal(null); resetPinModal() }

  const handleToggleLock = (v: boolean) => {
    if (v && !pinHash) {
      setPinModal("set")
      return
    }
    setLockEnabled(v)
    addToast(v ? "Lock on close enabled" : "Lock on close disabled", "success")
  }

  const handleLockNow = () => {
    if (!pinHash) { addToast("Set a PIN first to lock the app", "warning"); return }
    lock()
  }

  const validateNewPin = (pin: string, confirm: string): string => {
    if (pin.length < 4) return "PIN must be at least 4 digits"
    if (pin !== confirm) return "PINs do not match"
    return ""
  }

  const handleSetPin = () => {
    const err = validateNewPin(newPin, confirmPin)
    if (err) { setPinError(err); return }
    setPin(newPin)
    setLockEnabled(true)
    setPinSuccess(true)
    addToast("PIN set successfully. Auto-lock enabled.", "success")
    setTimeout(closePinModal, 1200)
  }

  const handleChangePin = () => {
    if (!verifyPin(currentPin)) { setPinError("Current PIN is incorrect"); return }
    const err = validateNewPin(newPin, confirmPin)
    if (err) { setPinError(err); return }
    setPin(newPin)
    setPinSuccess(true)
    addToast("PIN changed successfully", "success")
    setTimeout(closePinModal, 1200)
  }

  const handleRemovePin = () => {
    if (!verifyPin(currentPin)) { setPinError("PIN is incorrect"); return }
    removePin()
    setPinSuccess(true)
    addToast("PIN removed. Auto-lock disabled.", "info")
    setTimeout(closePinModal, 1200)
  }

  return (
    <div className="p-6 space-y-5 max-w-[800px] mx-auto">

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Sun size={18} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Appearance</h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Customize the look of Finance OS</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "light", label: "Light", icon: Sun, desc: "Clean light interface" },
            { value: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
            { value: "system", label: "System", icon: Monitor, desc: "Follow system theme" },
          ].map(({ value, label, icon: Icon, desc }) => (
            <button
              key={value}
              onClick={() => setTheme(value as "light" | "dark" | "system")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${theme === value ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "hover:border-blue-300 dark:hover:border-blue-700"}`}
              style={theme !== value ? { borderColor: "var(--border-color)" } : {}}
            >
              <Icon size={20} className={theme === value ? "text-blue-600" : ""} style={theme !== value ? { color: "var(--text-muted)" } : {}} />
              <p className="font-semibold text-sm mt-2" style={{ color: "var(--text-primary)" }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{desc}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Currency */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span className="text-green-600 font-bold text-sm">₹</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Currency & Format</h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Choose your primary display currency</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => { setCurrency(c.code); updateUser({ currency: c.code }) }}
              className={`p-3 rounded-xl border-2 text-left transition-all ${currency === c.code ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "hover:border-blue-300 dark:hover:border-blue-700"}`}
              style={currency !== c.code ? { borderColor: "var(--border-color)" } : {}}
            >
              <p className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{c.symbol}</p>
              <p className="font-semibold text-sm mt-0.5" style={{ color: "var(--text-primary)" }}>{c.code}</p>
              <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{c.name}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Bell size={18} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Notification Preferences</h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Control what alerts you receive</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label: "Budget Alerts", desc: "Notify when spending approaches or exceeds budget" },
            { label: "Goal Milestones", desc: "Celebrate goal progress and completions" },
            { label: "Bill Reminders", desc: "Alert before recurring payments are due" },
            { label: "Monthly Summary", desc: "End-of-month financial overview" },
            { label: "Large Transactions", desc: "Alert for unusually large expenses" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-10 h-5 rounded-full bg-gray-200 dark:bg-gray-700 peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
              </label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Auto-Lock / Security */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Lock size={18} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Lock & PIN Security</h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Lock the app when you close the tab or browser</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Enable toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "var(--bg-page)" }}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${lockEnabled ? "bg-purple-100 dark:bg-purple-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                <Lock size={15} className={lockEnabled ? "text-purple-600" : ""} style={!lockEnabled ? { color: "var(--text-muted)" } : {}} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Lock on Close</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {pinHash ? "Require PIN when reopening the app" : "Set a PIN to enable lock on close"}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={lockEnabled}
                onChange={(e) => handleToggleLock(e.target.checked)}
              />
              <div className="w-10 h-5 rounded-full bg-gray-200 dark:bg-gray-700 peer-checked:bg-purple-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
            </label>
          </div>

          {/* PIN status + actions */}
          <div className="p-4 rounded-xl" style={{ background: "var(--bg-page)" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>PIN Code</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {pinHash ? "4–6 digit PIN is set" : "No PIN configured"}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${pinHash ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800"}`}>
                {pinHash ? "Active" : "Not set"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {!pinHash ? (
                <button
                  onClick={() => { resetPinModal(); setPinModal("set") }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  Set PIN
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { resetPinModal(); setPinModal("change") }}
                    className="px-4 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                    style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                  >
                    Change PIN
                  </button>
                  <button
                    onClick={() => { resetPinModal(); setPinModal("remove") }}
                    className="px-4 py-2 rounded-lg text-xs font-medium border border-red-200 dark:border-red-900 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Remove PIN
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Lock now */}
          {pinHash && (
            <button
              onClick={handleLockNow}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <Lock size={15} />
              Lock App Now
            </button>
          )}
        </div>
      </motion.div>

      {/* Security (password / 2FA) */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Shield size={18} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Account Security</h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Manage password and authentication</p>
          </div>
        </div>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-white/5" style={{ border: "1px solid var(--border-color)" }}>
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Change Password</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Last changed 30 days ago →</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-white/5" style={{ border: "1px solid var(--border-color)" }}>
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Two-Factor Authentication</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Not enabled</span>
          </button>
          <button
            onClick={() => { logout() }}
            className="w-full flex items-center gap-2.5 p-3 rounded-xl transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <LogOut size={15} />
            <span className="text-sm font-medium">Sign Out of All Devices</span>
          </button>
        </div>
      </motion.div>

      {/* Data */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <Database size={18} className="text-teal-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Data Management</h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Export, import, or manage your data</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-gray-50 dark:hover:bg-white/10" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Export CSV</button>
          <button className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-gray-50 dark:hover:bg-white/10" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Export JSON</button>
          <button className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-gray-50 dark:hover:bg-white/10" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Import CSV</button>
          <button className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 border-red-200 dark:border-red-900">Clear All Data</button>
        </div>
      </motion.div>

      {/* PIN Modal */}
      <AnimatePresence>
        {pinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.55)" }}
            onClick={(e) => { if (e.target === e.currentTarget) closePinModal() }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
            >
              {pinSuccess ? (
                <div className="flex flex-col items-center py-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                    <Check size={26} className="text-green-600" />
                  </div>
                  <p className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
                    {pinModal === "set" ? "PIN Set!" : pinModal === "change" ? "PIN Changed!" : "PIN Removed!"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Lock size={16} className="text-purple-600" />
                      </div>
                      <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                        {pinModal === "set" ? "Set PIN" : pinModal === "change" ? "Change PIN" : "Remove PIN"}
                      </h3>
                    </div>
                    <button onClick={closePinModal} className="p-1 rounded-lg hover:opacity-70" style={{ color: "var(--text-muted)" }}>
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(pinModal === "change" || pinModal === "remove") && (
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                          Current PIN
                        </label>
                        <PinInput value={currentPin} onChange={setCurrentPin} placeholder="Current PIN" />
                      </div>
                    )}

                    {(pinModal === "set" || pinModal === "change") && (
                      <>
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                            New PIN <span style={{ color: "var(--text-muted)" }}>(4–6 digits)</span>
                          </label>
                          <PinInput value={newPin} onChange={setNewPin} placeholder="New PIN" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                            Confirm New PIN
                          </label>
                          <PinInput value={confirmPin} onChange={setConfirmPin} placeholder="Confirm PIN" />
                        </div>
                      </>
                    )}

                    {pinError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 font-medium"
                      >
                        {pinError}
                      </motion.p>
                    )}

                    {pinModal === "set" && (
                      <p className="text-xs p-3 rounded-xl" style={{ background: "var(--bg-page)", color: "var(--text-muted)" }}>
                        💡 You'll need this PIN when you reopen the app after closing the tab or browser.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={closePinModal}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                      style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={pinModal === "set" ? handleSetPin : pinModal === "change" ? handleChangePin : handleRemovePin}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${pinModal === "remove" ? "bg-red-500 hover:bg-red-600" : "bg-purple-600 hover:bg-purple-700"}`}
                    >
                      {pinModal === "set" ? "Set PIN" : pinModal === "change" ? "Update PIN" : "Remove PIN"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

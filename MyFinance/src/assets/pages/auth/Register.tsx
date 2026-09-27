import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Eye, EyeOff, DollarSign, CheckCircle } from "lucide-react"
import { useAuthStore } from "../../store/useAuthStore"
import { useUIStore } from "../../store/useUIStore"
import { CURRENCIES } from "../../constants/data"

interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  currency: string
  monthlyIncome?: number
  terms: boolean
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Lowercase letter", ok: /[a-z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
  ]
  const score = checks.filter((c) => c.ok).length
  const colors = ["", "#DC2626", "#F59E0B", "#F59E0B", "#16A34A"]

  if (!password) return null

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full transition-colors" style={{ background: i <= score ? colors[score] : "var(--border-color)" }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        {checks.map((c) => (
          <div key={c.label} className={`flex items-center gap-1 text-xs ${c.ok ? "text-green-500" : ""}`} style={!c.ok ? { color: "var(--text-muted)" } : {}}>
            <CheckCircle size={11} className={c.ok ? "text-green-500" : "opacity-30"} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Register() {
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register: registerUser } = useAuthStore()
  const { addToast } = useUIStore()
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { currency: "INR" },
  })

  const password = watch("password", "")

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      addToast("Passwords do not match", "error")
      return
    }
    if (!data.terms) {
      addToast("Please accept the terms", "error")
      return
    }
    setLoading(true)
    const result = await registerUser({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      currency: data.currency,
      monthlyIncome: data.monthlyIncome ? Number(data.monthlyIncome) : undefined,
    })
    setLoading(false)
    if (result.success) {
      navigate("/dashboard", { replace: true })
    } else {
      addToast(result.error || "Registration failed", "error")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: "var(--bg-page)" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <DollarSign size={18} className="text-white" />
          </div>
          <span className="font-bold tracking-widest text-sm" style={{ color: "var(--text-primary)" }}>FINANCE OS</span>
        </div>

        <div className="mb-7">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Create Your Account</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Start managing your finances smarter today.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Full Name *</label>
            <input
              placeholder="Srinath Kumar"
              {...register("fullName", { required: "Name is required", minLength: { value: 2, message: "Name too short" } })}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-blue-500"
              style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email Address *</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
              })}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-blue-500"
              style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Password *</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Min 8 characters" },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: "Need uppercase, lowercase, number",
                    },
                  })}
                  className="w-full px-3 py-3 pr-9 rounded-xl border text-sm outline-none focus:border-blue-500"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              <PasswordStrength password={password} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword", { required: "Please confirm" })}
                  className="w-full px-3 py-3 pr-9 rounded-xl border text-sm outline-none focus:border-blue-500"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Currency</label>
              <select
                {...register("currency")}
                className="w-full px-3 py-3 rounded-xl border text-sm outline-none"
                style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Monthly Income</label>
              <input
                type="number"
                placeholder="Optional"
                {...register("monthlyIncome", { min: 0 })}
                className="w-full px-3 py-3 rounded-xl border text-sm outline-none focus:border-blue-500"
                style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 text-sm cursor-pointer" style={{ color: "var(--text-secondary)" }}>
            <input type="checkbox" {...register("terms")} className="mt-0.5 rounded" />
            <span>
              I agree to the{" "}
              <span className="text-blue-600 cursor-pointer">Terms of Service</span>
              {" "}and{" "}
              <span className="text-blue-600 cursor-pointer">Privacy Policy</span>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

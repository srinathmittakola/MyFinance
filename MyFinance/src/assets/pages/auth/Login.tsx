import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Eye, EyeOff, DollarSign, TrendingUp, Shield, Target } from "lucide-react"
import { useAuthStore } from "../../store/useAuthStore"
import { useUIStore } from "../../store/useUIStore"

interface FormData {
  email: string
  password: string
  remember: boolean
}

export default function Login() {
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuthStore()
  const { addToast } = useUIStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>()

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true })
  }, [isAuthenticated, navigate])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const result = await login(data.email, data.password)
    setLoading(false)
    if (result.success) {
      navigate("/dashboard", { replace: true })
    } else {
      addToast(result.error || "Login failed", "error")
    }
  }

  const fillDemo = () => {
    setValue("email", "demo@financeos.app")
    setValue("password", "Demo@1234")
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-page)" }}>
      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "#071A3D" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #2563EB, transparent)" }} />
        <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
        <div className="absolute top-1/2 right-12 w-48 h-48 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #16A34A, transparent)" }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
            <DollarSign size={20} className="text-white" />
          </div>
          <span className="text-white font-bold tracking-widest text-lg">FINANCE OS</span>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 space-y-4">
          <h2 className="text-white text-3xl font-bold leading-tight mb-8">
            Take control of your<br />financial future.
          </h2>
          {[
            { icon: TrendingUp, title: "Track Every Rupee", desc: "Full income and expense tracking with real-time insights." },
            { icon: Target, title: "Achieve Your Goals", desc: "Set financial goals and track your progress to success." },
            { icon: Shield, title: "Smart Budgeting", desc: "Stay on track with intelligent budget alerts and analytics." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{title}</p>
                <p className="text-white/50 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-white/30 text-xs relative z-10">© 2026 Finance OS. Your data stays private.</p>
      </motion.div>

      {/* Right Panel - Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <DollarSign size={18} className="text-white" />
            </div>
            <span className="font-bold tracking-widest" style={{ color: "var(--text-primary)" }}>FINANCE OS</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Welcome Back</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Take control of your money and build your financial future.
            </p>
          </div>

          {/* Demo hint */}
          <div
            className="mb-6 p-3 rounded-xl border text-sm flex items-center justify-between"
            style={{ background: "rgba(37,99,235,0.08)", borderColor: "rgba(37,99,235,0.2)" }}
          >
            <span style={{ color: "var(--text-secondary)" }}>Try the demo account</span>
            <button
              onClick={fillDemo}
              className="text-blue-600 font-semibold hover:text-blue-700 text-xs"
            >
              Fill Demo →
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Email Address
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
                })}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                  className="w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                <input type="checkbox" {...register("remember")} className="rounded" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>OR</span>
            <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
          </div>

          <button className="w-full mt-4 py-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

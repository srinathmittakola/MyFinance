import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-page)" }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8">
        <div className="text-8xl font-black mb-4" style={{ color: "var(--border-color)" }}>404</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Page Not Found</h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          <Home size={16} />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  )
}

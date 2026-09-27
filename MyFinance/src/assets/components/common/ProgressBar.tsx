import { motion } from "framer-motion"

interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  height?: number
  showLabel?: boolean
  className?: string
  animated?: boolean
}

export default function ProgressBar({
  value, max = 100, color = "#2563EB", height = 6, showLabel, className, animated = true
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const displayColor = percentage >= 100 ? "#DC2626" : percentage >= 80 ? "#F59E0B" : color

  return (
    <div className={className}>
      <div
        className="rounded-full overflow-hidden"
        style={{ height, background: "var(--border-color)" }}
      >
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: displayColor }}
        />
      </div>
      {showLabel && (
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          {percentage.toFixed(1)}%
        </p>
      )}
    </div>
  )
}

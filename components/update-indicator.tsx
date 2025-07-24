"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { RefreshCw } from "lucide-react"

interface UpdateIndicatorProps {
  isUpdating?: boolean
  hasNewData?: boolean
  lastUpdated?: Date | null
  className?: string
  onClick?: () => void
}

export function UpdateIndicator({
  isUpdating = false,
  hasNewData = false,
  lastUpdated = null,
  className,
  onClick,
}: UpdateIndicatorProps) {
  const [showPulse, setShowPulse] = useState(false)

  // Show pulse animation when new data arrives
  useEffect(() => {
    if (hasNewData) {
      setShowPulse(true)
      const timer = setTimeout(() => setShowPulse(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasNewData])

  // Format the last updated time
  const formattedTime = lastUpdated
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(lastUpdated)
    : null

  return (
    <div className={cn("flex items-center gap-1.5 text-xs transition-opacity", className)}>
      <button
        onClick={onClick}
        disabled={isUpdating}
        className={cn(
          "p-1 rounded-full transition-all",
          isUpdating ? "animate-spin" : "hover:bg-gray-100 dark:hover:bg-gray-800",
          hasNewData && "text-green-600 dark:text-green-400",
        )}
        title="Refresh data"
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </button>

      {showPulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      )}

      {formattedTime && <span className="text-gray-500 dark:text-gray-400">Updated {formattedTime}</span>}
    </div>
  )
}

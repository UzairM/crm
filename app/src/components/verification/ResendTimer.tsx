/**
 * A countdown timer component for email verification code resend functionality.
 * Displays a circular progress indicator and a resend button that becomes active after the countdown.
 * 
 * Features:
 * - 60-second countdown timer with visual progress
 * - Circular progress indicator
 * - Automatic timer reset on resend
 * - Loading state handling
 * - Accessible button states
 * 
 * @component
 * @example
 * ```tsx
 * <ResendTimer
 *   onResend={handleResendCode}
 *   isResending={isResending}
 * />
 * ```
 */

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'

/**
 * Props for the ResendTimer component
 * @interface
 */
interface ResendTimerProps {
  /** Function to call when the user requests a new code */
  onResend: () => Promise<void>
  /** Whether a new code is currently being sent */
  isResending: boolean
}

export function ResendTimer({ onResend, isResending }: ResendTimerProps) {
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsActive(false)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, timeLeft])

  const handleResend = async () => {
    await onResend()
    setTimeLeft(60)
    setIsActive(true)
  }

  // Calculate the circle's circumference and offset
  const radius = 12
  const circumference = 2 * Math.PI * radius
  const offset = ((60 - timeLeft) / 60) * circumference

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      {isActive && (
        <div className="relative h-8 w-8 shrink-0">
          <svg className="absolute h-8 w-8 -rotate-90 transform">
            {/* Background circle */}
            <circle
              cx="16"
              cy="16"
              r={radius}
              className="fill-none stroke-foreground/20"
              strokeWidth="2"
            />
            {/* Countdown circle */}
            <circle
              cx="16"
              cy="16"
              r={radius}
              className="fill-none stroke-foreground transition-all duration-150 ease-linear"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
            {timeLeft}
          </span>
        </div>
      )}
      <Button
        type="button"
        variant="ghost"
        onClick={handleResend}
        disabled={isActive || isResending}
        className={`text-sm ${isActive ? 'text-muted-foreground' : 'text-primary hover:text-primary/90'}`}
      >
        Didn&apos;t get the email? Resend Code
      </Button>
    </div>
  )
} 

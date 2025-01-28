/**
 * Password Requirements Component
 * 
 * Displays dynamic password validation requirements with real-time feedback.
 * Shows only unmet requirements that smoothly animate out when satisfied.
 * 
 * Features:
 * - Real-time validation feedback
 * - Animated requirements that disappear when met
 * - Requirements reappear if validation fails
 * - Smooth height and opacity transitions
 * - Only shows when input is focused or has content
 * 
 * Requirements checked:
 * - Minimum 8 characters
 * - Uppercase letter presence
 * - Lowercase letter presence
 * - Number presence
 * - Special character presence
 * 
 * @example
 * ```tsx
 * // Basic usage with visibility control
 * <PasswordRequirements 
 *   password={password} 
 *   isVisible={isPasswordFocused || password.length > 0}
 * />
 * 
 * // Typical usage with input
 * <div className="flex flex-col">
 *   <Input 
 *     type="password"
 *     value={password}
 *     onChange={(e) => setPassword(e.target.value)}
 *     onFocus={() => setIsVisible(true)}
 *     onBlur={() => setIsVisible(false)}
 *   />
 *   <PasswordRequirements 
 *     password={password} 
 *     isVisible={isVisible}
 *   />
 * </div>
 * ```
 */

import { XCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface Requirement {
  test: (password: string) => boolean
  text: string
}

const requirements: Requirement[] = [
  {
    test: (password) => password.length >= 8,
    text: 'At least 8 characters'
  },
  {
    test: (password) => /[A-Z]/.test(password),
    text: 'One uppercase letter'
  },
  {
    test: (password) => /[a-z]/.test(password),
    text: 'One lowercase letter'
  },
  {
    test: (password) => /\d/.test(password),
    text: 'One number'
  },
  {
    test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    text: 'One symbol (!@#$%^&*(),.?":{}|<>)'
  }
]

interface PasswordRequirementsProps {
  password: string
  isVisible: boolean
}

export function PasswordRequirements({ password, isVisible }: PasswordRequirementsProps) {
  if (!isVisible) return null

  return (
    <div className="space-y-1 text-sm mt-2">
      <AnimatePresence>
        {requirements.map((req, index) => {
          const isMet = req.test(password)
          if (isMet) return null

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-muted-foreground overflow-hidden"
            >
              <XCircle className="h-4 w-4 shrink-0" />
              <span>{req.text}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
} 

/**
 * A styled textarea component with neumorphic design.
 * Provides a multi-line text input with consistent styling and focus states.
 * 
 * Features:
 * - Neumorphic shadow styling
 * - Minimum height setting
 * - Full width by default
 * - Consistent border and focus states
 * - Disabled state handling
 * - Placeholder text support
 * - Proper text wrapping
 * 
 * @component
 * @example
 * ```tsx
 * // Basic textarea
 * <Textarea placeholder="Enter your message" />
 * 
 * // Textarea with rows
 * <Textarea 
 *   rows={4}
 *   placeholder="Describe your issue"
 * />
 * 
 * // Disabled textarea
 * <Textarea
 *   disabled
 *   value="This content cannot be edited"
 * />
 * 
 * // Textarea with custom styles
 * <Textarea
 *   className="min-h-[100px] font-mono"
 *   placeholder="Code snippet..."
 * />
 * ```
 */

import * as React from "react"
import { cn } from "../../lib/utils"

/**
 * Props interface for Textarea component
 * Extends all native textarea HTML attributes
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          "neu-shadow-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea } 
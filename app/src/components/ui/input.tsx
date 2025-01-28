"use client"

/**
 * A styled input component with neumorphic design.
 * Extends native input element with consistent styling and focus states.
 * Includes shadow effects and proper transitions.
 * 
 * Features:
 * - Neumorphic shadow styling
 * - Consistent border and focus states
 * - File input styling support
 * - Disabled state handling
 * - Full width by default
 * 
 * @component
 * @example
 * ```tsx
 * // Basic text input
 * <Input type="text" placeholder="Enter your name" />
 * 
 * // Password input
 * <Input type="password" />
 * 
 * // Disabled input
 * <Input disabled value="Can't edit this" />
 * 
 * // File input
 * <Input type="file" accept="image/*" />
 * ```
 */

import * as React from "react"

import { cn } from "../../lib/utils"

/**
 * Props interface for Input component
 * Extends all native input HTML attributes
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          "neu-shadow-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

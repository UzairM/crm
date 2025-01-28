/**
 * An accessible label component built on Radix UI's Label primitive.
 * Provides consistent styling and proper association with form controls.
 * 
 * Features:
 * - Proper HTML semantics
 * - Automatic form control association
 * - Consistent text styling
 * - Disabled state handling
 * - Screen reader support
 * - Peer-based styling with form elements
 * 
 * @component
 * @example
 * ```tsx
 * // Basic label with input
 * <div className="space-y-2">
 *   <Label htmlFor="email">Email</Label>
 *   <Input id="email" type="email" />
 * </div>
 * 
 * // Label with required indicator
 * <Label htmlFor="name">
 *   Name <span className="text-red-500">*</span>
 * </Label>
 * 
 * // Label with checkbox
 * <div className="flex items-center space-x-2">
 *   <Checkbox id="terms" />
 *   <Label htmlFor="terms">
 *     I agree to the terms and conditions
 *   </Label>
 * </div>
 * 
 * // Disabled label with form control
 * <div className="space-y-2">
 *   <Label htmlFor="disabled" className="opacity-50">
 *     Disabled field
 *   </Label>
 *   <Input id="disabled" disabled />
 * </div>
 * ```
 */

"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/**
 * Style variants for the label component
 * Includes peer-based styling for disabled states
 */
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

/**
 * Label component for form controls
 * Built on Radix UI's Label primitive for accessibility
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

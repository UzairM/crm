/**
 * A neumorphic checkbox component built on Radix UI's Checkbox primitive.
 * Provides an accessible and stylish way to capture boolean input.
 * 
 * Features:
 * - Neumorphic shadow styling
 * - Animated check mark
 * - Focus visible states
 * - Disabled state handling
 * - Keyboard navigation support
 * - Screen reader support
 * - Form control integration
 * 
 * States:
 * - Unchecked (default)
 * - Checked (with animated check mark)
 * - Disabled (reduced opacity)
 * - Focused (ring outline)
 * 
 * @component
 * @example
 * ```tsx
 * // Basic checkbox
 * <Checkbox />
 * 
 * // Checkbox with label
 * <div className="flex items-center space-x-2">
 *   <Checkbox id="terms" />
 *   <label
 *     htmlFor="terms"
 *     className="text-sm font-medium leading-none"
 *   >
 *     Accept terms and conditions
 *   </label>
 * </div>
 * 
 * // Controlled checkbox
 * const [checked, setChecked] = useState(false)
 * <Checkbox
 *   checked={checked}
 *   onCheckedChange={setChecked}
 * />
 * 
 * // Disabled checkbox
 * <Checkbox disabled />
 * ```
 */

"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "../../lib/utils"

/**
 * Checkbox component with neumorphic styling
 * Built on Radix UI's Checkbox primitive for accessibility
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary",
      "neu-shadow-sm",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

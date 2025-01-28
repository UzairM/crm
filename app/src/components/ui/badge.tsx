/**
 * A versatile badge component with neumorphic styling.
 * Used for labels, status indicators, and counters.
 * 
 * Variants:
 * - default: Standard badge with neumorphic shadow
 * - secondary: Alternative style with secondary color
 * - destructive: Red badge for warnings/errors
 * - outline: Simple outlined style without background
 * 
 * Features:
 * - Neumorphic shadows
 * - Hover states
 * - Focus ring for accessibility
 * - Consistent text size and padding
 * - Responsive design
 * 
 * @component
 * @example
 * ```tsx
 * // Default badge
 * <Badge>New</Badge>
 * 
 * // Secondary badge
 * <Badge variant="secondary">Updated</Badge>
 * 
 * // Destructive badge
 * <Badge variant="destructive">Error</Badge>
 * 
 * // Outline badge
 * <Badge variant="outline">Draft</Badge>
 * 
 * // Badge with custom class
 * <Badge className="my-2">Custom</Badge>
 * ```
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/**
 * Style variants for the badge component
 * Uses class-variance-authority for variant management
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "neu-shadow-sm bg-background text-foreground hover:bg-background/80",
        secondary:
          "neu-shadow-sm bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "neu-shadow-sm border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Props interface for Badge component
 * Extends HTML div attributes and variant props
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge component for displaying short status text
 * Renders as a div with variant-based styling
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

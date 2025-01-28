/**
 * A composable alert component with neumorphic styling.
 * Used for displaying important messages, warnings, or errors.
 * 
 * Components:
 * - Alert: Root container with variants
 * - AlertTitle: Main heading of the alert
 * - AlertDescription: Detailed message content
 * 
 * Variants:
 * - default: Standard alert with neumorphic shadow
 * - destructive: Red-tinted alert for errors/warnings
 * 
 * Features:
 * - Neumorphic shadow styling
 * - Icon support with automatic positioning
 * - Semantic HTML structure
 * - ARIA role="alert" for accessibility
 * - Responsive design
 * - Flexible content layout
 * 
 * @component
 * @example
 * ```tsx
 * // Basic alert
 * <Alert>
 *   <AlertTitle>Heads up!</AlertTitle>
 *   <AlertDescription>
 *     You can add components to your app using the cli.
 *   </AlertDescription>
 * </Alert>
 * 
 * // Destructive alert with icon
 * <Alert variant="destructive">
 *   <ExclamationIcon className="h-4 w-4" />
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>
 *     Your session has expired. Please log in again.
 *   </AlertDescription>
 * </Alert>
 * 
 * // Alert with custom styling
 * <Alert className="border-primary/50 bg-primary/10">
 *   <AlertTitle>Note</AlertTitle>
 *   <AlertDescription>
 *     This is a custom styled alert.
 *   </AlertDescription>
 * </Alert>
 * ```
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

/**
 * Style variants for the alert component
 * Uses class-variance-authority for variant management
 */
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "neu-shadow bg-background text-foreground",
        destructive:
          "neu-shadow border-destructive/50 text-destructive bg-destructive/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Root alert container with variant support
 * Can include icons and multiple content sections
 */
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

/**
 * Main heading for the alert
 * Uses proper heading semantics with h5
 */
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h5>
))
AlertTitle.displayName = "AlertTitle"

/**
 * Detailed message content for the alert
 * Supports paragraphs and rich text
 */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

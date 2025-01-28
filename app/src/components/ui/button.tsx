/**
 * A versatile button component with multiple variants and sizes.
 * Built on Radix UI's Slot primitive for composition.
 * Includes neumorphic styling and proper focus states.
 * 
 * Variants:
 * - default: Standard button with neumorphic shadow
 * - destructive: Red background for dangerous actions
 * - outline: Outlined button with hover effect
 * - secondary: Subtle alternative style
 * - ghost: No background until hover
 * - link: Appears as an underlined link
 * 
 * Sizes:
 * - default: Standard size
 * - sm: Small button
 * - lg: Large button
 * - icon: Square button for icons
 * 
 * @component
 * @example
 * ```tsx
 * // Default button
 * <Button>Click me</Button>
 * 
 * // Destructive button with small size
 * <Button variant="destructive" size="sm">Delete</Button>
 * 
 * // Icon button
 * <Button variant="ghost" size="icon">
 *   <Icon />
 * </Button>
 * ```
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/**
 * Button variants configuration using class-variance-authority
 * Defines the available variants and sizes with their corresponding styles
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "neu-shadow bg-background text-foreground hover:bg-background/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "neu-shadow bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary:
          "neu-shadow bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Props for the Button component
 * Extends standard button props and variant props
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Whether to render the button as a child component */
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

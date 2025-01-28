/**
 * A composable toast notification system built on Radix UI's Toast primitive.
 * Features a neumorphic design with swipe-to-dismiss and animations.
 * 
 * Components:
 * - ToastProvider: Manages toast notifications globally
 * - ToastViewport: Container where toasts appear
 * - Toast: Individual toast notification
 * - ToastTitle: Main message of the toast
 * - ToastDescription: Additional details
 * - ToastClose: Dismiss button
 * - ToastAction: Optional action button
 * 
 * Variants:
 * - default: Standard toast with neumorphic shadow
 * - success: Green toast for success messages
 * - destructive: Red toast for errors/warnings
 * 
 * Features:
 * - Swipe to dismiss
 * - Animated transitions
 * - Mobile responsive
 * - Screen reader support
 * - Custom duration
 * - Action buttons
 * - Neumorphic styling
 * 
 * @component
 * @example
 * ```tsx
 * // Provider setup (in root layout)
 * <ToastProvider>
 *   <App />
 *   <ToastViewport />
 * </ToastProvider>
 * 
 * // Using toast (with useToast hook)
 * const { toast } = useToast()
 * 
 * toast({
 *   title: "Success!",
 *   description: "Your changes have been saved.",
 *   variant: "success",
 *   action: <ToastAction altText="Undo">Undo</ToastAction>
 * })
 * 
 * // Custom toast component
 * <Toast variant="destructive">
 *   <ToastTitle>Error</ToastTitle>
 *   <ToastDescription>Something went wrong.</ToastDescription>
 *   <ToastClose />
 * </Toast>
 * ```
 */

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"

/** Global toast notification provider */
const ToastProvider = ToastPrimitives.Provider

/**
 * Container for toast notifications
 * Positioned at the top-right by default
 */
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 right-4 flex max-h-screen w-full flex-col gap-2 p-4 md:max-w-[420px] z-[100]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

/**
 * Style variants for toast notifications
 * Includes default, success, and destructive variants
 */
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border-border bg-background text-foreground shadow-soft",
        success: "bg-emerald-50 border-emerald-200 text-emerald-900 shadow-soft-success",
        destructive:
          "destructive group border-destructive/30 bg-destructive text-destructive-foreground shadow-soft-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Individual toast notification component
 * Can be customized with variants and additional props
 */
const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

/**
 * Optional action button for toast notifications
 * Styled differently for destructive toasts
 */
const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

/**
 * Close button for dismissing toasts
 * Appears on hover with proper focus states
 */
const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

/**
 * Main heading of the toast notification
 * Uses semibold text for emphasis
 */
const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

/**
 * Secondary text for additional context
 * Slightly transparent for visual hierarchy
 */
const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

/** Props for the Toast component */
type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

/** Type for toast action elements */
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}

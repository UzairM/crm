/**
 * A global toast notification container component.
 * Renders all active toasts from the toast store with consistent styling.
 * 
 * Features:
 * - Automatic toast rendering from global store
 * - Success variant styling by default
 * - Support for title and description
 * - Optional action buttons
 * - Close button included
 * - Proper viewport positioning
 * 
 * @component
 * @example
 * ```tsx
 * // Add to your app's root layout
 * export default function RootLayout() {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <Toaster />
 *       </body>
 *     </html>
 *   )
 * }
 * 
 * // Show a toast from anywhere in your app
 * const { toast } = useToast()
 * toast({
 *   title: "Success!",
 *   description: "Your changes have been saved.",
 *   action: <ToastAction>Undo</ToastAction>
 * })
 * ```
 */

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"
import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} variant="success">
            <div className="grid gap-1.5">
              {title && <ToastTitle className="text-base font-medium">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-sm text-emerald-800/90">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
} 

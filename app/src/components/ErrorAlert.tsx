/**
 * A reusable error alert component that displays error messages with a destructive style.
 * Uses Lucide's AlertCircle icon and Shadcn's Alert component for consistent styling.
 * 
 * @component
 * @example
 * ```tsx
 * <ErrorAlert message="An error occurred while processing your request." />
 * ```
 */

import { Alert, AlertDescription } from '../components/ui/alert'
import { AlertCircle } from 'lucide-react'

/**
 * Props for the ErrorAlert component
 * @interface
 */
interface ErrorAlertProps {
  /** The error message to display */
  message: string
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
} 
/**
 * A reusable email form component used in verification flows.
 * Includes input validation, loading states, and error handling.
 * Uses Shadcn components for consistent styling.
 * 
 * @component
 * @example
 * ```tsx
 * <EmailForm
 *   email={email}
 *   setEmail={setEmail}
 *   onSubmit={handleSubmit}
 *   isLoading={isLoading}
 *   error={error}
 *   submitText="Verify Email"
 *   loadingText="Verifying..."
 * />
 * ```
 */

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertCircle } from "lucide-react"

/**
 * Props for the EmailForm component
 * @interface
 */
interface EmailFormProps {
  /** Current email value */
  email: string
  /** Function to update email value */
  setEmail: (email: string) => void
  /** Form submission handler */
  onSubmit: (e: React.FormEvent) => Promise<void>
  /** Whether the form is in a loading state */
  isLoading: boolean
  /** Error message to display, if any */
  error: string | null
  /** Text to display on the submit button */
  submitText: string
  /** Text to display on the submit button while loading */
  loadingText: string
}

export function EmailForm({ 
  email, 
  setEmail, 
  onSubmit, 
  isLoading, 
  error,
  submitText,
  loadingText
}: EmailFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <Button 
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-white"
      >
        {isLoading ? loadingText : submitText}
      </Button>
    </form>
  )
} 
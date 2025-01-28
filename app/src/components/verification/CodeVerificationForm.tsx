/**
 * A verification code input form component with enhanced UX features.
 * Supports 6-digit code input with auto-focus, paste functionality, and keyboard navigation.
 * Uses Shadcn components for consistent styling.
 * 
 * Features:
 * - Auto-focuses next input on digit entry
 * - Supports paste functionality for the entire code
 * - Keyboard navigation (backspace moves to previous input)
 * - Input validation (numbers only)
 * - Loading states and error handling
 * 
 * @component
 * @example
 * ```tsx
 * <CodeVerificationForm
 *   code={code}
 *   setCode={setCode}
 *   onSubmit={handleSubmit}
 *   isLoading={isLoading}
 *   error={error}
 *   submitText="Verify Code"
 *   loadingText="Verifying..."
 * />
 * ```
 */

import { useRef } from 'react'
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertCircle } from "lucide-react"

/**
 * Props for the CodeVerificationForm component
 * @interface
 */
interface CodeVerificationFormProps {
  /** Array of 6 digits representing the verification code */
  code: string[]
  /** Function to update the verification code array */
  setCode: (code: string[]) => void
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

export function CodeVerificationForm({
  code,
  setCode,
  onSubmit,
  isLoading,
  error,
  submitText,
  loadingText
}: CodeVerificationFormProps) {
  const codeRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const handleCodeChange = (index: number, value: string) => {
    // Handle single digit input
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)

    // If a digit was entered and there's a next input, focus it
    if (value && index < 5) {
      codeRefs[index + 1].current?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const digits = pastedData.replace(/\D/g, '').slice(0, 6)
    
    if (digits) {
      const newCode = [...code]
      digits.split('').forEach((digit, i) => {
        if (i < 6) newCode[i] = digit
      })
      setCode(newCode)

      // Focus the next empty box or the last box
      const nextEmptyIndex = newCode.findIndex(digit => !digit)
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
        codeRefs[nextEmptyIndex].current?.focus()
      } else {
        codeRefs[5].current?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // On backspace, if empty and there's a previous input, focus it
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeRefs[index - 1].current?.focus()
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="code-0">Verification Code</Label>
        <div className="flex gap-2 items-center justify-between">
          {code.map((digit, index) => (
            <Input
              key={index}
              id={`code-${index}`}
              ref={codeRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              required
              className="w-12 h-12 text-center text-lg font-semibold"
            />
          ))}
        </div>
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
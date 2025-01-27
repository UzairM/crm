import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertCircle } from "lucide-react"

interface EmailFormProps {
  email: string
  setEmail: (email: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  isLoading: boolean
  error: string | null
  submitText: string
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
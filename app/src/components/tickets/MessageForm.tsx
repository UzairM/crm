/**
 * A form component for adding messages or internal notes to a ticket.
 * Supports both client-facing replies and internal notes (for Agents/Managers only).
 * Uses Shadcn components for consistent styling and accessibility.
 * 
 * Features:
 * - Text area for message input
 * - Toggle for internal notes (Agents/Managers only)
 * - Loading states during submission
 * - Error handling and display
 * - Role-based UI adaptation
 * 
 * @component
 * @example
 * ```tsx
 * <MessageForm
 *   ticketId={123}
 *   onMessageSent={() => {
 *     // Refresh ticket messages
 *     refetchMessages()
 *   }}
 * />
 * ```
 */

import { useState } from 'react'
import { api } from '../../lib/api'
import { useAuthStore } from '../../stores/auth'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'

/**
 * Props for the MessageForm component
 * @interface
 */
interface MessageFormProps {
  /** ID of the ticket to add the message to */
  ticketId: number
  /** Callback function to execute after a message is successfully sent */
  onMessageSent: () => void
}

export function MessageForm({ ticketId, onMessageSent }: MessageFormProps) {
  const [text, setText] = useState('')
  const [isInternalNote, setIsInternalNote] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const user = useAuthStore(state => state.user)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setIsSending(true)
    setError('')

    try {
      await api.post(`/api/tickets/${ticketId}/messages`, {
        text: text.trim(),
        isInternalNote: isInternalNote
      })
      setText('')
      onMessageSent()
    } catch (err) {
      setError('Failed to send message')
      console.error(err)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-card rounded-lg shadow p-4 border border-border">
      <div className="mb-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isInternalNote ? "Add an internal note..." : "Type your reply..."}
          className="min-h-[100px]"
          disabled={isSending}
        />
      </div>
      
      <div className="flex items-center justify-between">
        {user?.role !== 'CLIENT' && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="internal-note"
              checked={isInternalNote}
              onCheckedChange={(checked) => setIsInternalNote(checked as boolean)}
              disabled={isSending}
            />
            <Label
              htmlFor="internal-note"
              className="text-sm text-muted-foreground"
            >
              Internal Note
            </Label>
          </div>
        )}
        
        <Button
          type="submit"
          disabled={isSending || !text.trim()}
          variant={isInternalNote ? "secondary" : "default"}
        >
          {isSending ? 'Sending...' : isInternalNote ? 'Add Note' : 'Send Reply'}
        </Button>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-destructive">
          {error}
        </div>
      )}
    </form>
  )
} 
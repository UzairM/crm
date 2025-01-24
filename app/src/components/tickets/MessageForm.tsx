import { useState } from 'react'
import { api } from '../../lib/api'

interface MessageFormProps {
  ticketId: string
  onMessageSent: () => void
}

export function MessageForm({ ticketId, onMessageSent }: MessageFormProps) {
  const [text, setText] = useState('')
  const [isInternalNote, setIsInternalNote] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setIsSending(true)
    setError('')

    try {
      await api.post(`/tickets/${ticketId}/messages`, {
        text: text.trim(),
        is_internal_note: isInternalNote
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
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isInternalNote ? "Add an internal note..." : "Type your reply..."}
          className="w-full min-h-[100px] p-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          disabled={isSending}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isInternalNote}
            onChange={(e) => setIsInternalNote(e.target.checked)}
            className="rounded border-input text-primary focus:ring-ring"
            disabled={isSending}
          />
          <span className="text-sm text-muted-foreground">Internal Note</span>
        </label>
        
        <button
          type="submit"
          disabled={isSending || !text.trim()}
          className={`px-4 py-2 rounded-md text-sm font-medium
            ${isSending || !text.trim()
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : isInternalNote
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }
          `}
        >
          {isSending ? 'Sending...' : isInternalNote ? 'Add Note' : 'Send Reply'}
        </button>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-destructive">
          {error}
        </div>
      )}
    </form>
  )
} 
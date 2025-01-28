/**
 * A detailed view component for a single ticket.
 * Displays ticket information, client details, message history, and a message form.
 * Handles ticket status updates and message management.
 * 
 * Features:
 * - Automatic ticket read status update
 * - Status toggle (open/closed)
 * - Client information card
 * - Message thread with internal notes
 * - Role-based message filtering
 * - Message composition form
 * - Loading and error states
 * 
 * @component
 * @example
 * ```tsx
 * // Used with React Router
 * <Route path="/tickets/:ticketId" element={<TicketDetail />} />
 * ```
 */

import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Ticket, TicketMessage } from '../../types/ticket'
import { api } from '../../lib/api'
import { LoadingSpinner } from '../LoadingSpinner'
import { ErrorAlert } from '../ErrorAlert'
import { MessageForm } from './MessageForm'
import { ArrowLeft, X, Check } from 'lucide-react'
import { useAuthStore } from '../../stores/auth'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'

/**
 * Interface for client information displayed in the sidebar
 * @interface
 */
interface Client {
  /** Unique identifier for the client */
  id: number
  /** Client's full name */
  name: string
  /** Client's email address */
  email: string
}

interface TicketDetailProps {
  ticketId?: number | string
  variant?: 'default' | 'chat'
}

export function TicketDetail({ ticketId: propTicketId, variant = 'default' }: TicketDetailProps) {
  const { ticketId: paramTicketId } = useParams()
  const ticketId = propTicketId?.toString() || paramTicketId
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const user = useAuthStore(state => state.user)

  const fetchTicketData = useCallback(async () => {
    if (!ticketId) return
    try {
      const [ticketResponse, messagesResponse] = await Promise.all([
        api.get(`/api/tickets/${ticketId}`),
        api.get(`/api/tickets/${ticketId}/messages`)
      ])
      
      // Mark ticket as read only if user is not a CLIENT
      if (!ticketResponse.data.isRead && user?.role !== 'CLIENT') {
        await api.patch(`/api/tickets/${ticketId}/read`)
        // Update ticket status to OPEN when marked as read
        if (ticketResponse.data.status === 'NEW') {
          await api.patch(`/api/tickets/${ticketId}`, { status: 'OPEN' })
          ticketResponse.data.status = 'OPEN'
        }
        // Update the isRead status in the local ticket data
        ticketResponse.data.isRead = true
      }
      
      setTicket(ticketResponse.data)
      setMessages(messagesResponse.data)
      
      // Fetch client info if we have a ticket
      if (ticketResponse.data.clientId) {
        const clientResponse = await api.get(`/api/users/${ticketResponse.data.clientId}`)
        setClient(clientResponse.data)
      }
    } catch (err) {
      setError('Failed to load ticket details')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [ticketId, user?.role])

  useEffect(() => {
    fetchTicketData()
  }, [fetchTicketData])

  const toggleTicketStatus = async () => {
    if (!ticket) return
    try {
      const newStatus = ticket.status === 'OPEN' ? 'CLOSED' : 'OPEN'
      await api.patch(`/api/tickets/${ticketId}`, { status: newStatus })
      setTicket(prev => prev ? { ...prev, status: newStatus } : null)
    } catch (err) {
      setError('Failed to update ticket status')
      console.error(err)
    }
  }

  if (variant === 'chat') {
    if (isLoading || !ticket) return <LoadingSpinner />
    if (error) return <ErrorAlert message={error} />

    return (
      <div className="flex flex-col h-full">
        <div className="flex-none p-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-medium">{ticket.subject}</h3>
              <Badge variant={
                !ticket.isRead ? 'default' :
                ticket.status === 'NEW' ? 'secondary' :
                ticket.status === 'OPEN' ? 'outline' :
                'default'
              }>
                {!ticket.isRead ? 'UNREAD' : ticket.status}
              </Badge>
            </div>
            {ticket.status !== 'NEW' && (
              <Button
                onClick={toggleTicketStatus}
                variant={ticket.status === 'OPEN' ? 'destructive' : 'default'}
                size="sm"
              >
                {ticket.status === 'OPEN' ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Close Ticket
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Reopen Ticket
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages
              .filter(message => !message.isInternalNote || user?.role !== 'CLIENT')
              .map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[80%] rounded-lg p-4",
                    message.senderId === (user?.id ?? -1)
                      ? "ml-auto bg-gradient-to-br from-muted/30 to-background shadow-neu text-foreground" 
                      : "bg-gradient-to-br from-primary/20 to-accent/20 shadow-neu-dark",
                    message.isInternalNote && "border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-50/50 to-yellow-100/30 shadow-neu-sm"
                  )}
                >
                  <div className="flex flex-col gap-1 mb-2">
                    <span className="text-sm font-medium">
                      {message.sender.name || message.sender.email}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="flex-none p-4 border-t border-border/40">
          {ticketId && (
            <>
              {ticket.status === 'CLOSED' ? (
                <div className="bg-muted/30 rounded-lg p-4 text-center text-sm text-muted-foreground shadow-neu">
                  This ticket is closed. You cannot send new messages.
                </div>
              ) : (
                <MessageForm 
                  ticketId={parseInt(ticketId)} 
                  onMessageSent={fetchTicketData}
                />
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  // Return original layout for default variant
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorAlert message={error} />
  if (!ticket) return null

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="space-y-8">
          <div className="flex items-center">
            <Button variant="ghost" asChild className="hover:bg-muted/5">
              <Link to="/tickets" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Tickets
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
            <div>
              <h1 className="text-2xl font-bold mb-4 text-foreground">
                {ticket.subject}
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant={
                  !ticket.isRead ? 'default' :
                  ticket.status === 'NEW' ? 'secondary' :
                  ticket.status === 'OPEN' ? 'outline' :
                  'default'
                }>
                  {!ticket.isRead ? 'UNREAD' : ticket.status}
                </Badge>
                {ticket.status !== 'NEW' && (
                  <Button
                    onClick={toggleTicketStatus}
                    variant={ticket.status === 'OPEN' ? 'destructive' : 'default'}
                    size="sm"
                    className="transition-all duration-200"
                  >
                    {ticket.status === 'OPEN' ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Close Ticket
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Reopen Ticket
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {client && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-sm">{client.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-sm">{client.email}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {messages
              .filter(message => !message.isInternalNote || user?.role !== 'CLIENT')
              .map((message) => (
                <Card
                  key={message.id}
                  className={message.isInternalNote ? 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-900/20' : ''}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium text-foreground">
                        {message.sender.name ? (
                          <>
                            {message.sender.name}
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({message.sender.email})
                            </span>
                          </>
                        ) : (
                          message.sender.email
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-foreground leading-relaxed">{message.text}</p>
                    {message.isInternalNote && user?.role !== 'CLIENT' && (
                      <Badge variant="outline" className="mt-4 bg-yellow-100/50 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
                        Internal Note
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>

          <div className="pt-4">
            <MessageForm 
              ticketId={ticket.id} 
              onMessageSent={fetchTicketData}
            />
          </div>
        </div>
      </main>
    </div>
  )
} 

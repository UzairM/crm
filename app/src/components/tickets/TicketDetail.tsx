import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Ticket, TicketMessage } from '@/types/ticket'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorAlert } from '@/components/ErrorAlert'
import { MessageForm } from './MessageForm'
import { Header } from '@/components/Header'
import { ArrowLeft, X, Check } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Client {
  id: number
  name: string
  email: string
}

export function TicketDetail() {
  const { ticketId } = useParams()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const user = useAuthStore(state => state.user)

  const fetchTicketData = useCallback(async () => {
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
        const clientResponse = await api.get(`/api/clients/${ticketResponse.data.clientId}`)
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

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorAlert message={error} />
  if (!ticket) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/tickets" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Tickets
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2 text-foreground">
                {ticket.subject}
              </h1>
              <div className="space-y-2">
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
                    className="ml-2"
                  >
                    {ticket.status === 'OPEN' ? (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Close Ticket
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1" />
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
                  <CardTitle className="text-lg">Client Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{client.name}</p>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {messages
            .filter(message => !message.isInternalNote || user?.role !== 'CLIENT')
            .map((message) => (
              <Card
                key={message.id}
                className={message.isInternalNote ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/20' : ''}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between mb-2">
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
                  <p className="whitespace-pre-wrap text-foreground">{message.text}</p>
                  {message.isInternalNote && user?.role !== 'CLIENT' && (
                    <Badge variant="outline" className="mt-2 bg-yellow-100/50 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
                      Internal Note
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="mt-6">
          <MessageForm 
            ticketId={ticket.id} 
            onMessageSent={fetchTicketData}
          />
        </div>
      </main>
    </div>
  )
} 

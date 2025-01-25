import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Ticket, TicketMessage } from '../../types/ticket'
import { api } from '../../lib/api'
import { LoadingSpinner } from '../LoadingSpinner'
import { ErrorAlert } from '../ErrorAlert'
import { MessageForm } from './MessageForm'
import { Header } from '../Header'
import { ArrowLeftIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/solid'
import { useAuthStore } from '../../stores/auth'

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

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorAlert message={error} />
  if (!ticket) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            to="/tickets" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Tickets
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2 text-foreground">
                {ticket.subject}
              </h1>
              <div>
                <span className={`px-2 py-1 rounded-md text-sm font-medium
                  ${!ticket.isRead ? 'bg-primary text-primary-foreground' : 
                    ticket.status === 'NEW' ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100' :
                    ticket.status === 'OPEN' ? 'bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-100' :
                    'bg-muted text-muted-foreground'}`}
                >
                  {!ticket.isRead ? 'UNREAD' : ticket.status}
                </span>
                {ticket.status !== 'NEW' && (
                  <button
                    onClick={toggleTicketStatus}
                    className={`block mt-2 inline-flex items-center px-2 py-1 rounded-md text-sm font-medium transition-colors
                      ${ticket.status === 'OPEN' 
                        ? 'bg-muted hover:bg-muted/90 text-muted-foreground' 
                        : 'bg-teal-100 hover:bg-teal-200 text-teal-900 dark:bg-teal-900 dark:hover:bg-teal-800 dark:text-teal-100'}`}
                  >
                    {ticket.status === 'OPEN' ? (
                      <>
                        <XMarkIcon className="w-4 h-4 mr-1" />
                        Close Ticket
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Reopen Ticket
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            {client && (
              <div className="bg-card p-4 rounded-lg border border-border">
                <h3 className="font-semibold mb-2 text-foreground">Client Information</h3>
                <p className="text-sm text-muted-foreground">{client.name}</p>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {messages
            .filter(message => !message.isInternalNote || user?.role !== 'CLIENT')
            .map((message) => (
            <div 
              key={message.id}
              className={`p-4 rounded-lg ${
                message.isInternalNote 
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                  : 'bg-card border border-border'
              }`}
            >
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
                <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                  Internal Note
                </div>
              )}
            </div>
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

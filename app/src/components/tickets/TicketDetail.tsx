import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Ticket, TicketMessage } from '../../types/ticket'
import { api } from '../../lib/api'
import { LoadingSpinner } from '../LoadingSpinner'
import { ErrorAlert } from '../ErrorAlert'
import { MessageForm } from './MessageForm'
import { Header } from '../Header'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'

interface Client {
  id: string
  name: string
  email: string
}

// Placeholder data for development
const PLACEHOLDER_DATA = {
  ticket: {
    id: '1',
    subject: 'Unable to access premium features',
    status: 'Open' as const,
    assigned_agent_id: 'agent_1',
    client_id: 'client_1',
    created_at: '2024-01-24T10:00:00Z',
    updated_at: '2024-01-24T14:30:00Z',
    is_read: false
  },
  messages: [
    {
      id: '1',
      ticket_id: '1',
      sender: 'John Doe',
      text: 'Hi, I purchased the premium plan yesterday but still cannot access any of the premium features. Can you help?',
      is_internal_note: false,
      created_at: '2024-01-24T10:00:00Z'
    },
    {
      id: '2',
      ticket_id: '1',
      sender: 'Support Agent',
      text: 'Let me check the payment status and account permissions.',
      is_internal_note: true,
      created_at: '2024-01-24T10:15:00Z'
    },
    {
      id: '3',
      ticket_id: '1',
      sender: 'Support Agent',
      text: "I can see your payment was successful. There seems to be a delay in permission propagation. I'll fix this right away.",
      is_internal_note: false,
      created_at: '2024-01-24T10:20:00Z'
    }
  ],
  client: {
    id: 'client_1',
    name: 'John Doe',
    email: 'john.doe@example.com'
  }
}

export function TicketDetail() {
  const { ticketId } = useParams()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTicketData = useCallback(async () => {
    try {
      // Use placeholder data for development
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          const ticket = { ...PLACEHOLDER_DATA.ticket }
          if (!ticket.is_read) {
            ticket.is_read = true
            // Also update the placeholder data for future loads
            PLACEHOLDER_DATA.ticket.is_read = true
          }
          setTicket(ticket)
          setMessages(PLACEHOLDER_DATA.messages)
          setClient(PLACEHOLDER_DATA.client)
          setIsLoading(false)
        }, 500) // Simulate loading
        return
      }

      const [ticketResponse, messagesResponse] = await Promise.all([
        api.get(`/tickets/${ticketId}`),
        api.get(`/tickets/${ticketId}/messages`)
      ])
      
      setTicket(ticketResponse.data)
      setMessages(messagesResponse.data)
      
      // Fetch client info if we have a ticket
      if (ticketResponse.data.client_id) {
        const clientResponse = await api.get(`/clients/${ticketResponse.data.client_id}`)
        setClient(clientResponse.data)
      }

      // Mark ticket as read
      if (!ticketResponse.data.is_read) {
        await api.patch(`/tickets/${ticketId}/read`)
      }
    } catch (err) {
      setError('Failed to load ticket details')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [ticketId])

  useEffect(() => {
    fetchTicketData()
  }, [fetchTicketData])

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorAlert message={error} />
  if (!ticket) return <ErrorAlert message="Ticket not found" />

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
              <span className={`px-2 py-1 rounded-md text-sm font-medium
                ${ticket.status === 'New' ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100' : ''}
                ${ticket.status === 'Open' ? 'bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-100' : ''}
                ${ticket.status === 'Closed' ? 'bg-muted text-muted-foreground' : ''}`}
              >
                {ticket.status}
              </span>
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
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`p-4 rounded-lg ${
                message.is_internal_note 
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                  : 'bg-card border border-border'
              }`}
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium text-foreground">{message.sender}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(message.created_at).toLocaleString()}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-foreground">{message.text}</p>
              {message.is_internal_note && (
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

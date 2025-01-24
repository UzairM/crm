import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Ticket, TicketStatus } from '../../types/ticket'
import { api } from '../../lib/api'
import { LoadingSpinner } from '../LoadingSpinner'
import { ErrorAlert } from '../ErrorAlert'
import { Header } from '../Header'

// Placeholder data for development
const PLACEHOLDER_TICKETS: Ticket[] = [
  {
    id: '1',
    subject: 'Unable to access premium features',
    status: 'Open',
    assigned_agent_id: 'agent_1',
    client_id: 'client_1',
    created_at: '2024-01-24T10:00:00Z',
    updated_at: '2024-01-24T14:30:00Z',
    is_read: false
  },
  {
    id: '2',
    subject: 'Billing cycle question',
    status: 'New',
    assigned_agent_id: 'agent_1',
    client_id: 'client_2',
    created_at: '2024-01-24T09:00:00Z',
    updated_at: '2024-01-24T09:00:00Z',
    is_read: false
  },
  {
    id: '3',
    subject: 'Feature request: Dark mode',
    status: 'Closed',
    assigned_agent_id: 'agent_1',
    client_id: 'client_3',
    created_at: '2024-01-23T15:00:00Z',
    updated_at: '2024-01-23T16:45:00Z',
    is_read: true
  },
  {
    id: '4',
    subject: 'Integration with Slack',
    status: 'Open',
    assigned_agent_id: 'agent_1',
    client_id: 'client_4',
    created_at: '2024-01-24T11:30:00Z',
    updated_at: '2024-01-24T13:15:00Z',
    is_read: true
  },
  {
    id: '5',
    subject: 'Password reset not working',
    status: 'New',
    assigned_agent_id: 'agent_1',
    client_id: 'client_5',
    created_at: '2024-01-24T14:00:00Z',
    updated_at: '2024-01-24T14:00:00Z',
    is_read: false
  }
]

export function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Use placeholder data for development
        if (process.env.NODE_ENV === 'development') {
          setTimeout(() => {
            let filteredTickets = [...PLACEHOLDER_TICKETS]
            
            const status = searchParams.get('status')?.toLowerCase()
            const unread = searchParams.get('unread') === 'true'
            
            if (status) {
              filteredTickets = filteredTickets.filter(
                ticket => ticket.status.toLowerCase() === status
              )
            }
            
            if (unread) {
              filteredTickets = filteredTickets.filter(
                ticket => !ticket.is_read
              )
            }
            
            setTickets(filteredTickets)
            setIsLoading(false)
          }, 500) // Simulate loading
          return
        }

        const status = searchParams.get('status')?.toLowerCase()
        const unread = searchParams.get('unread')
        
        const params = new URLSearchParams()
        if (status) params.append('status', status)
        if (unread === 'true') params.append('unread', 'true')
        
        const response = await api.get(`/tickets?${params.toString()}`)
        setTickets(response.data)
      } catch (err) {
        setError('Failed to load tickets')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTickets()
  }, [searchParams])

  const handleFilterChange = (status: TicketStatus | '', unread: boolean) => {
    const params = new URLSearchParams(searchParams)
    if (status) {
      params.set('status', status.toLowerCase())
    } else {
      params.delete('status')
    }
    if (unread) {
      params.set('unread', 'true')
    } else {
      params.delete('unread')
    }
    setSearchParams(params)
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorAlert message={error} />

  const currentStatus = searchParams.get('status')?.toUpperCase() as TicketStatus | undefined
  const currentUnread = searchParams.get('unread') === 'true'

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Tickets
          </h1>
          <div className="flex gap-4">
            <select
              value={currentStatus || ''}
              onChange={(e) => handleFilterChange(e.target.value as TicketStatus | '', currentUnread)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Status</option>
              <option value="NEW">New</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentUnread}
                onChange={(e) => handleFilterChange(currentStatus || '', e.target.checked)}
                className="rounded border-input text-primary focus:ring-ring"
              />
              <span className="text-sm text-muted-foreground">Unread Only</span>
            </label>
          </div>
        </div>
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className={`w-full text-left p-4 rounded-lg shadow-sm border transition-colors
                ${!ticket.is_read ? 'border-l-4 border-primary' : 'border-border'}
                bg-card hover:bg-card/80`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-foreground">{ticket.subject}</h3>
                <span className={`px-2 py-1 rounded-md text-sm font-medium
                  ${ticket.status === 'New' ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100' : ''}
                  ${ticket.status === 'Open' ? 'bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-100' : ''}
                  ${ticket.status === 'Closed' ? 'bg-muted text-muted-foreground' : ''}`}
                >
                  {ticket.status}
                </span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Created: {new Date(ticket.created_at).toLocaleDateString()}
              </div>
            </button>
          ))}
          {tickets.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No tickets found
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 

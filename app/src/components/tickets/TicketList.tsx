import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Ticket, TicketStatus } from '../../types/ticket'
import { api } from '../../lib/api'
import { LoadingSpinner } from '../LoadingSpinner'
import { ErrorAlert } from '../ErrorAlert'

export function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const status = searchParams.get('status')?.toLowerCase()
        const unread = searchParams.get('unread')
        
        const params = new URLSearchParams()
        if (status) params.append('status', status)
        if (unread === 'true') params.append('unread', 'true')
        
        const response = await api.get(`/api/tickets?${params.toString()}`)
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
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Tickets
        </h1>
        <div className="flex gap-4">
          <select
            value={currentStatus || ''}
            onChange={(e) => handleFilterChange(e.target.value as TicketStatus | '', currentUnread)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Tickets</option>
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

      {tickets.map((ticket) => (
        <button
          key={ticket.id}
          onClick={() => navigate(`/tickets/${ticket.id}`)}
          className={`w-full text-left p-4 rounded-lg shadow-sm border transition-colors
            ${!ticket.isRead ? 'border-l-4 border-primary' : 'border-border'}
            bg-card hover:bg-card/80`}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-foreground">{ticket.subject}</h3>
            <span className={`px-2 py-1 rounded-md text-sm font-medium
              ${!ticket.isRead ? 'bg-primary text-primary-foreground' : 
                ticket.status === 'NEW' ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100' :
                ticket.status === 'OPEN' ? 'bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-100' :
                'bg-muted text-muted-foreground'}`}
            >
              {!ticket.isRead ? 'UNREAD' : ticket.status}
            </span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Created: {new Date(ticket.createdAt).toLocaleDateString()}
            {ticket.client && ` • ${ticket.client.email}`}
          </div>
        </button>
      ))}
      {tickets.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No tickets found
        </div>
      )}
    </div>
  )
} 

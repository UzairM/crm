/**
 * A list view component for displaying and filtering tickets.
 * Provides status and unread filters, and handles ticket navigation.
 * Adapts its behavior based on user role (Client vs Agent/Manager).
 * 
 * Features:
 * - Status filtering (All, Open, Closed)
 * - Unread filter toggle
 * - URL-based filter state
 * - Visual indicators for unread tickets
 * - Role-based navigation paths
 * - Loading and error states
 * - Empty state handling
 * 
 * @component
 * @example
 * ```tsx
 * // Used with React Router
 * <Route path="/tickets" element={<TicketList />} />
 * // Or for client portal
 * <Route path="/portal/tickets" element={<TicketList />} />
 * ```
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Ticket, TicketStatus } from '../../types/ticket'
import { api } from '../../lib/api'
import { LoadingSpinner } from '../LoadingSpinner'
import { ErrorAlert } from '../ErrorAlert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { useAuthStore } from '../../stores/auth'
import { cn } from '../../lib/utils'

interface TicketListProps {
  onTicketSelect?: (ticketId: number) => void
  selectedTicketId?: number
  variant?: 'default' | 'inbox'
  filter?: string
  unread?: boolean
}

export function TicketList({ onTicketSelect, selectedTicketId, variant = 'default', filter = 'OPEN', unread = false }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const user = useAuthStore(state => state.user)
  const session = useAuthStore(state => state.session)
  const mountedRef = useRef(true)

  const fetchTickets = useCallback(async () => {
    if (!mountedRef.current) return
    
    try {
      const params = new URLSearchParams()
      
      // Use the filter prop instead of searchParams for inbox variant
      if (variant === 'inbox') {
        if (filter && filter !== 'ALL') {
          params.append('status', filter)
        }
        if (unread) {
          params.append('unread', 'true')
        }
      } else {
        const status = searchParams.get('status')?.toUpperCase()
        if (status && status !== 'ALL') {
          params.append('status', status)
        }
        if (searchParams.get('unread') === 'true') {
          params.append('unread', 'true')
        }
      }
      
      const response = await api.get(`/api/tickets?${params.toString()}`)
      
      if (!mountedRef.current) return
      
      setTickets(response.data)
      setIsLoading(false)
    } catch (err) {
      console.error('Failed to fetch tickets:', err)
      if (mountedRef.current) {
        setError('Failed to load tickets')
        setIsLoading(false)
      }
    }
  }, [searchParams, variant, filter, unread])

  useEffect(() => {
    if (user && session) {
      fetchTickets()
    }
  }, [user, session, filter, unread, fetchTickets])

  const handleFilterChange = (status: TicketStatus | 'ALL', unread: boolean) => {
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
    setSearchParams(params, { replace: true })
  }

  const handleTicketClick = (ticketId: number) => {
    if (onTicketSelect) {
      onTicketSelect(ticketId)
    } else if (user?.role === 'CLIENT') {
      navigate(`/portal/tickets/${ticketId}`)
    } else {
      navigate(`/tickets/${ticketId}`)
    }
  }

  if (!user || !session) {
    return <LoadingSpinner />
  }

  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (error) {
    return <ErrorAlert message={error} />
  }

  const currentStatus = searchParams.get('status')?.toUpperCase() as TicketStatus | undefined
  const currentUnread = searchParams.get('unread') === 'true'

  if (variant === 'inbox') {
    return (
      <div className="divide-y divide-border/40">
        {tickets.map((ticket) => (
          <button
            key={ticket.id}
            onClick={() => handleTicketClick(ticket.id)}
            className={cn(
              "w-full text-left p-4",
              "hover:bg-accent/50 transition-colors",
              selectedTicketId === ticket.id && "bg-accent",
              !ticket.isRead && "bg-primary/10 border-l-2 border-l-primary"
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white font-medium shadow-sm",
                !ticket.isRead ? "bg-primary shadow-primary/20" : "bg-muted"
              )}>
                {ticket.client?.name?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!ticket.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/20" />
                    )}
                    <h3 className={cn(
                      "text-sm truncate",
                      !ticket.isRead ? "font-semibold" : "font-medium"
                    )}>
                      {ticket.subject}
                    </h3>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {ticket.client?.email}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">
          Tickets
        </h1>
        <div className="flex gap-4 items-center">
          <Select
            value={currentStatus || 'ALL'}
            onValueChange={(value) => handleFilterChange(value as TicketStatus | 'ALL', currentUnread)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Tickets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Tickets</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="unread"
              checked={currentUnread}
              onCheckedChange={(checked) => handleFilterChange(currentStatus || 'ALL', checked as boolean)}
            />
            <label
              htmlFor="unread"
              className="text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Unread Only
            </label>
          </div>
        </div>
      </div>

      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          className={`${!ticket.isRead ? 'border-l-4 border-l-primary' : ''} cursor-pointer transition-all duration-200 hover:bg-muted/5`}
          onClick={() => handleTicketClick(ticket.id)}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg text-foreground">{ticket.subject}</h3>
              <Badge variant={
                !ticket.isRead ? 'default' :
                ticket.status === 'NEW' ? 'secondary' :
                ticket.status === 'OPEN' ? 'outline' :
                'default'
              }>
                {!ticket.isRead ? 'UNREAD' : ticket.status}
              </Badge>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Created: {new Date(ticket.createdAt).toLocaleDateString()}
              {ticket.client && ` • ${ticket.client.email}`}
            </div>
          </CardContent>
        </Card>
      ))}
      {tickets.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No tickets found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

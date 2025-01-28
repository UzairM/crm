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

export function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const renderCount = useRef(0)
  const user = useAuthStore(state => state.user)
  const session = useAuthStore(state => state.session)
  const mountedRef = useRef(true)

  console.log('TicketList render:', {
    renderCount: ++renderCount.current,
    isLoading,
    error,
    ticketsCount: tickets.length,
    hasUser: !!user,
    hasSession: !!session,
    userEmail: user?.email
  })

  const fetchTickets = useCallback(async () => {
    if (!mountedRef.current) return
    
    try {
      console.log('Fetching tickets...')
      const status = searchParams.get('status')?.toLowerCase()
      const unread = searchParams.get('unread')
      
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      if (unread === 'true') params.append('unread', 'true')
      
      console.log('Making API request:', `/api/tickets?${params.toString()}`)
      const response = await api.get(`/api/tickets?${params.toString()}`)
      console.log('API response:', response.data)

      if (!mountedRef.current) {
        console.log('Component unmounted during fetch, abandoning update')
        return
      }

      setTickets(response.data)
      setIsLoading(false)
      console.log('Updated tickets state:', {
        ticketsCount: response.data.length,
        isLoading: false
      })
    } catch (err) {
      console.error('Failed to fetch tickets:', err)
      if (mountedRef.current) {
        setError('Failed to load tickets')
        setIsLoading(false)
        console.log('Set error state:', {
          error: 'Failed to load tickets',
          isLoading: false
        })
      }
    }
  }, [searchParams])

  useEffect(() => {
    console.log('TicketList mounted')
    mountedRef.current = true

    if (user && session) {
      fetchTickets()
    }

    return () => {
      console.log('TicketList unmounting')
      mountedRef.current = false
    }
  }, [user, session, fetchTickets])

  const handleFilterChange = (status: TicketStatus | 'ALL', unread: boolean) => {
    console.log('Filter change:', { status, unread })
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
    if (user?.role === 'CLIENT') {
      navigate(`/portal/tickets/${ticketId}`)
    } else {
      navigate(`/tickets/${ticketId}`)
    }
  }

  if (!user || !session) {
    console.log('No user or session, showing loading')
    return <LoadingSpinner />
  }

  if (isLoading) {
    console.log('Rendering loading state')
    return <LoadingSpinner />
  }
  
  if (error) {
    console.log('Rendering error state:', error)
    return <ErrorAlert message={error} />
  }

  const currentStatus = searchParams.get('status')?.toUpperCase() as TicketStatus | undefined
  const currentUnread = searchParams.get('unread') === 'true'

  console.log('Rendering ticket list:', {
    ticketsCount: tickets.length,
    currentStatus,
    currentUnread
  })

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

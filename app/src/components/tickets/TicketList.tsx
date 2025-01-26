import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Ticket, TicketStatus } from '@/types/ticket'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorAlert } from '@/components/ErrorAlert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
        <div className="flex gap-4 items-center">
          <Select
            value={currentStatus || ''}
            onValueChange={(value) => handleFilterChange(value as TicketStatus | '', currentUnread)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Tickets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tickets</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="unread"
              checked={currentUnread}
              onCheckedChange={(checked) => handleFilterChange(currentStatus || '', checked as boolean)}
            />
            <label
              htmlFor="unread"
              className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Unread Only
            </label>
          </div>
        </div>
      </div>

      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          className={`${!ticket.isRead ? 'border-l-4 border-l-primary' : ''} cursor-pointer`}
          onClick={() => navigate(`/tickets/${ticket.id}`)}
        >
          <CardContent className="p-4">
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
        <div className="text-center text-muted-foreground py-8">
          No tickets found
        </div>
      )}
    </div>
  )
}

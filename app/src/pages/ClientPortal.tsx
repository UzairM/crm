import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { PlusCircle } from 'lucide-react'
import { TicketList } from '../components/tickets/TicketList'

export default function ClientPortal() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Client Portal
            </h1>
            <p className="mt-2 text-muted-foreground text-lg">
              Manage your tickets and communications
            </p>
          </div>
          <Button 
            onClick={() => navigate('/portal/create-ticket')}
            className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <PlusCircle className="h-4 w-4" />
            Create New Ticket
          </Button>
        </div>
        
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="p-6">
            <TicketList />
          </div>
        </div>
      </div>
    </div>
  )
} 
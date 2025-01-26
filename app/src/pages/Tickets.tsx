import { Header } from '../components/Header'
import { TicketList } from '../components/tickets/TicketList'

export function TicketsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <TicketList />
      </main>
    </div>
  )
} 
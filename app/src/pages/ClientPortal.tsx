import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { PlusCircle } from 'lucide-react'
import { TicketList } from '../components/tickets/TicketList'
import { useAuthStore } from '../stores/auth'
import { useEffect, useRef, useState } from 'react'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Header } from '../components/Header'

export default function ClientPortal() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const session = useAuthStore((state) => state.session)
  const [isLoading, setIsLoading] = useState(true)
  const renderCount = useRef(0)

  useEffect(() => {
    console.log('ClientPortal mounted')
    return () => console.log('ClientPortal unmounted')
  }, [])

  useEffect(() => {
    console.log('ClientPortal auth state:', {
      hasUser: !!user,
      hasSession: !!session,
      userEmail: user?.email
    })
    setIsLoading(false)
  }, [user, session])

  console.log('ClientPortal render:', {
    renderCount: ++renderCount.current,
    isLoading,
    hasUser: !!user,
    hasSession: !!session
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (!user || !session) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
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
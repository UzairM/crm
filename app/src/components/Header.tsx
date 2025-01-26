import { useAuthStore } from '../stores/auth'
import { useHydrated } from '../hooks/useHydrated'
import { ory } from '../lib/ory'
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useRef } from 'react'

export function Header() {
  const user = useAuthStore((state) => state.user)
  const session = useAuthStore((state) => state.session)
  const isHydrated = useHydrated()
  const renderCount = useRef(0)

  useEffect(() => {
    console.log('Header mounted')
    return () => console.log('Header unmounted')
  }, [])

  console.log('Header render:', {
    renderCount: ++renderCount.current,
    isHydrated,
    hasUser: !!user,
    hasSession: !!session,
    userEmail: user?.email
  })

  const handleLogout = async () => {
    try {
      console.log('Initiating logout')
      const { data } = await ory.createBrowserLogoutFlow()
      window.location.href = data.logout_url
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Always render the base navigation structure
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-8">
          <Link to="/dashboard">
            <h1 className="text-xl font-bold text-foreground">
              Finance CRM
            </h1>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/dashboard" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/tickets" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Tickets
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-muted text-foreground">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-destructive focus:text-destructive" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
} 

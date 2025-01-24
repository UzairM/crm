import { useAuthStore } from '../stores/auth'
import { useHydrated } from '../hooks/useHydrated'
import { ory } from '../lib/ory'
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import { Link } from "react-router-dom"

export function Header() {
  const user = useAuthStore((state) => state.user)
  const isHydrated = useHydrated()

  const handleLogout = async () => {
    try {
      const { data } = await ory.createBrowserLogoutFlow()
      window.location.href = data.logout_url
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="border-b border-border/40 bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Finance CRM
              </h1>
            </Link>
            <nav className="hidden md:flex space-x-4 ml-8">
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
          <div className="flex items-center space-x-4">
            {isHydrated && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-border">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 

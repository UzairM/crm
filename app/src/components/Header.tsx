import { useAuthStore } from '../stores/auth'
import { useHydrated } from '../hooks/useHydrated'
import { ory } from '../lib/ory'
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { LogOut, User, Settings } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useRef } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { useThemeStore } from '../stores/theme'

export function Header() {
  const user = useAuthStore((state) => state.user)
  const session = useAuthStore((state) => state.session)
  const setUser = useAuthStore((state) => state.setUser)
  const setSession = useAuthStore((state) => state.setSession)
  const isHydrated = useHydrated()
  const theme = useThemeStore((state) => state.theme)
  const location = useLocation()
  const navigate = useNavigate()
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
      // Create a logout flow
      const { data } = await ory.createBrowserLogoutFlow()
      
      // Execute the logout flow
      await ory.updateLogoutFlow({ token: data.logout_token })
      
      // Clear local auth state
      setUser(null)
      setSession(null)
      
      // Navigate to login
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const logoSrc = theme === 'dark' ? '/logo-light.webp' : '/logo-dark.webp'
  const isLoginPage = location.pathname === '/login'

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <Link to={user?.role === 'CLIENT' ? '/portal' : '/dashboard'} className="flex items-center gap-2">
            <img 
              src={logoSrc} 
              alt="Finance CRM Logo" 
              className="h-6 w-auto"
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
          {user && !isLoginPage && (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/settings">
                <Settings className="h-5 w-5 text-foreground hover:text-foreground/80 transition-colors" />
              </Link>
            </Button>
          )}
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

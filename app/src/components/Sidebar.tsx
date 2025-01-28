/**
 * Collapsible sidebar component with role-based navigation
 * Expands on hover and shows icons with labels
 */

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { cn } from '../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Inbox,
  Bot,
  BookOpen,
  BarChart2,
  SendHorizontal,
  Users2,
  Search,
  Settings,
  User,
  ChevronRight
} from 'lucide-react'

interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
  roles?: string[]
  badge?: number
}

const navItems: NavItem[] = [
  {
    icon: <Inbox className="h-5 w-5" />,
    label: 'Inbox',
    href: '/inbox',
    badge: 4,
    roles: ['AGENT', 'MANAGER']
  },
  {
    icon: <Bot className="h-5 w-5" />,
    label: 'AI & Automation',
    href: '/ai',
    roles: ['AGENT', 'MANAGER']
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    label: 'Knowledge',
    href: '/knowledge',
    roles: ['AGENT', 'MANAGER', 'CLIENT']
  },
  {
    icon: <BarChart2 className="h-5 w-5" />,
    label: 'Reports',
    href: '/reports',
    roles: ['MANAGER']
  },
  {
    icon: <SendHorizontal className="h-5 w-5" />,
    label: 'Outbound',
    href: '/outbound',
    roles: ['AGENT', 'MANAGER']
  },
  {
    icon: <Users2 className="h-5 w-5" />,
    label: 'Clients',
    href: '/contacts',
    roles: ['AGENT', 'MANAGER']
  }
]

const bottomNavItems: NavItem[] = [
  {
    icon: <Search className="h-5 w-5" />,
    label: 'Search',
    href: '/search',
    roles: ['AGENT', 'MANAGER', 'CLIENT']
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: 'Settings',
    href: '/settings',
    roles: ['AGENT', 'MANAGER', 'CLIENT']
  },
  {
    icon: <User className="h-5 w-5" />,
    label: 'Profile',
    href: '/profile',
    roles: ['AGENT', 'MANAGER', 'CLIENT']
  }
]

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const location = useLocation()
  const user = useAuthStore((state) => state.user)

  if (!user) return null

  const filteredNavItems = navItems.filter(
    item => !item.roles || item.roles.includes(user.role)
  )

  const filteredBottomNavItems = bottomNavItems.filter(
    item => !item.roles || item.roles.includes(user.role)
  )

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isExpanded ? 256 : 64,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border/40 z-30 flex flex-col"
    >
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm relative overflow-hidden",
                "hover:bg-accent/50 hover:shadow-md",
                isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground",
                !isExpanded && "justify-center"
              )}
            >
              <motion.div
                className="flex-shrink-0 relative"
                layout
              >
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </motion.div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ 
                      opacity: 1, 
                      width: "auto",
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    exit={{ 
                      opacity: 0, 
                      width: 0,
                      transition: { duration: 0.2, ease: "easeIn" }
                    }}
                    className="ml-3 whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isActive && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    exit={{ 
                      opacity: 0, 
                      x: -10,
                      transition: { duration: 0.2, ease: "easeIn" }
                    }}
                    className="ml-auto"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </nav>

      <nav className="p-4 space-y-2 border-t border-border/40">
        {filteredBottomNavItems.map((item) => {
          const isActive = location.pathname === item.href
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm relative overflow-hidden",
                "hover:bg-accent/50 hover:shadow-md",
                isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground",
                !isExpanded && "justify-center"
              )}
            >
              <motion.div
                className="flex-shrink-0"
                layout
              >
                {item.icon}
              </motion.div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ 
                      opacity: 1, 
                      width: "auto",
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    exit={{ 
                      opacity: 0, 
                      width: 0,
                      transition: { duration: 0.2, ease: "easeIn" }
                    }}
                    className="ml-3 whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isActive && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    exit={{ 
                      opacity: 0, 
                      x: -10,
                      transition: { duration: 0.2, ease: "easeIn" }
                    }}
                    className="ml-auto"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </nav>
    </motion.aside>
  )
} 

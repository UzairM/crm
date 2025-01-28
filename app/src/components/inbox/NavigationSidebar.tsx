import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import { Search, Plus, Inbox } from 'lucide-react'
import { cn } from '../../lib/utils'
import { navItems, viewItems } from '../../data/inbox'

interface NavigationSidebarProps {
  isExpanded: boolean
}

export function NavigationSidebar({ isExpanded }: NavigationSidebarProps) {
  return (
    <motion.div 
      initial={false}
      animate={{ 
        width: isExpanded ? 200 : 64,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className="border-r border-border/40 flex flex-col h-full"
    >
      <div className="flex flex-col min-h-0 h-full">
        <div className="p-4 flex-none">
          <div className="flex items-center justify-between mb-6">
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div 
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <h2 className="text-lg font-semibold">Inbox</h2>
                  <Button size="icon" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Plus className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-lg font-semibold">
                    <Inbox className="h-5 w-5" />
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center justify-between px-2 py-1.5 text-sm rounded-md",
                  "hover:bg-accent/50",
                  "text-muted-foreground",
                  !isExpanded && "justify-center"
                )}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  <AnimatePresence mode="wait">
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                {isExpanded && typeof item.count === 'number' && (
                  <span className="text-xs">{item.count}</span>
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-6">
            <nav className="space-y-1">
              {viewItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-between px-2 py-1.5 text-sm rounded-md",
                    "hover:bg-accent/50",
                    "text-muted-foreground",
                    !isExpanded && "justify-center"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    <AnimatePresence mode="wait">
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  {isExpanded && typeof item.count === 'number' && (
                    <span className="text-xs">{item.count}</span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 
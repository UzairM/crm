import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import {
  Star,
  Mail,
  Moon,
  ImageIcon,
  ChevronDown,
  PanelLeftClose,
  PanelRightClose
} from 'lucide-react'
import { TicketList } from '../tickets/TicketList'
import { Conversation } from '../../types/inbox'

interface ConversationListProps {
  isNavExpanded: boolean
  toggleNav: () => void
  selectedConversation: string | null
  setSelectedConversation: (id: string | null) => void
  filter: string
  sortBy: string
  handleFilterChange: () => void
  handleSortChange: () => void
  isInbox: boolean
  conversations: Conversation[]
}

export function ConversationList({
  isNavExpanded,
  toggleNav,
  selectedConversation,
  setSelectedConversation,
  filter,
  sortBy,
  handleFilterChange,
  handleSortChange,
  isInbox,
  conversations
}: ConversationListProps) {
  return (
    <div className="w-[300px] flex flex-col h-full">
      <div className="flex-none border-b border-border/40">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleNav}
                className="hover:bg-accent/50"
              >
                {isNavExpanded ? (
                  <PanelLeftClose className="h-4 w-4 transition-transform" />
                ) : (
                  <PanelRightClose className="h-4 w-4 transition-transform" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Moon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-3"
              onClick={handleFilterChange}
            >
              {filter} <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-3"
              onClick={handleSortChange}
            >
              {sortBy} <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isInbox ? (
          <TicketList 
            onTicketSelect={(ticketId: number) => setSelectedConversation(ticketId.toString())}
            selectedTicketId={selectedConversation ? parseInt(selectedConversation) : undefined}
            variant="inbox"
          />
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={cn(
                "w-full text-left p-4 border-b border-border/40",
                "hover:bg-accent/50 transition-colors",
                selectedConversation === conv.id && "bg-accent"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white font-medium", conv.avatar.color)}>
                  {conv.avatar.letter}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        conv.status === 'active' ? "bg-green-500" : "bg-gray-300"
                      )} />
                      <h3 className="font-medium text-sm truncate">{conv.title}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground">{conv.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.preview}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
} 
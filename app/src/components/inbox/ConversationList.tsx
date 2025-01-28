import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import {
  Star,
  Mail,
  Moon,
  ImageIcon,
  PanelLeftClose,
  PanelRightClose
} from 'lucide-react'
import { TicketList } from '../tickets/TicketList'
import { Conversation } from '../../types/inbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"

interface ConversationListProps {
  isNavExpanded: boolean
  toggleNav: () => void
  selectedConversation: string | null
  setSelectedConversation: (id: string | null) => void
  filter: string
  unread: boolean
  handleFilterChange: (value: string) => void
  handleUnreadToggle: () => void
  isInbox: boolean
  conversations: Conversation[]
}

export function ConversationList({
  isNavExpanded,
  toggleNav,
  selectedConversation,
  setSelectedConversation,
  filter,
  unread,
  handleFilterChange,
  handleUnreadToggle,
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
            <Select 
              defaultValue="OPEN"
              onValueChange={handleFilterChange}
              value={filter}
            >
              <SelectTrigger className="h-8 px-3">
                <SelectValue placeholder="Filter tickets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="ALL">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <Button 
              variant={unread ? "default" : "outline"}
              size="sm" 
              className={cn(
                "h-8 px-3 relative",
                unread && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={handleUnreadToggle}
            >
              <Mail className="h-4 w-4 mr-2" />
              Unread
              {unread && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              )}
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
            filter={filter}
            unread={unread}
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
import { MessagesSquare, MessageSquare } from 'lucide-react'
import { Button } from '../ui/button'
import { TicketDetail } from '../tickets/TicketDetail'
import { cn } from '../../lib/utils'

interface MessengerViewProps {
  selectedConversation: string | null
  isInbox: boolean
}

export function MessengerView({ selectedConversation, isInbox }: MessengerViewProps) {
  return (
    <div className="flex-1 bg-card rounded-lg border border-border shadow-sm flex flex-col h-full">
      {selectedConversation && isInbox ? (
        <TicketDetail 
          key={selectedConversation}
          ticketId={parseInt(selectedConversation)}
          variant="chat"
        />
      ) : (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-none border-b border-border/40 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/5 shadow-neu-sm flex items-center justify-center">
                <MessagesSquare className="w-4 h-4 text-primary/70" />
              </div>
              <div>
                <h3 className="font-medium">Demo Message</h3>
                <p className="text-sm text-muted-foreground">This is how messages will appear</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* System Message */}
              <div className="flex justify-center">
                <div className={cn(
                  "bg-accent/30 text-sm rounded-md px-3 py-1 shadow-neu-sm",
                  "text-muted-foreground/90"
                )}>
                  This conversation started just now
                </div>
              </div>

              {/* Demo Message */}
              <div className="flex gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex-none flex items-center justify-center text-white shadow-neu",
                  "bg-gradient-to-br from-primary/80 to-primary/70"
                )}>
                  D
                </div>
                <div className="flex flex-col gap-1 max-w-[80%]">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium">Demo User</span>
                    <span className="text-xs text-muted-foreground">just now</span>
                  </div>
                  <div className={cn(
                    "rounded-lg p-3 shadow-neu",
                    "bg-gradient-to-br from-muted/40 to-muted/30",
                    "text-foreground/90"
                  )}>
                    <p>It shows how a customer conversation from the Messenger will look in your Inbox. 
                    Conversations handled by AI Agent will also appear here.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reply Area */}
          <div className="flex-none border-t border-border/40 p-4">
            <div className={cn(
              "rounded-lg p-3 shadow-neu",
              "bg-gradient-to-br from-muted/40 to-muted/30"
            )}>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">Type your reply here...</span>
              </div>
              <div className="mt-4 flex justify-end">
                <Button disabled className="shadow-neu-sm hover:shadow-neu-pressed active:shadow-neu-pressed">
                  Send message
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
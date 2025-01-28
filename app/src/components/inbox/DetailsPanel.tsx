import { Bot, User, Calendar, Tag, MessageSquare, History } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { DetailSection } from '../../types/inbox'

interface DetailsPanelProps {
  width: number
}

const detailSections: DetailSection[] = [
  {
    icon: <User className="h-4 w-4" />,
    label: 'Customer',
    defaultOpen: true,
    content: (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Name</p>
          <p className="text-sm">John Doe</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p className="text-sm">john@example.com</p>
        </div>
      </div>
    )
  },
  {
    icon: <Calendar className="h-4 w-4" />,
    label: 'Dates',
    content: (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Created</p>
          <p className="text-sm">Jan 1, 2024</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
          <p className="text-sm">Jan 2, 2024</p>
        </div>
      </div>
    )
  },
  {
    icon: <Tag className="h-4 w-4" />,
    label: 'Properties',
    content: (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <p className="text-sm">Open</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Priority</p>
          <p className="text-sm">Medium</p>
        </div>
      </div>
    )
  },
  {
    icon: <MessageSquare className="h-4 w-4" />,
    label: 'Conversation',
    content: (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Channel</p>
          <p className="text-sm">Email</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Messages</p>
          <p className="text-sm">3 messages</p>
        </div>
      </div>
    )
  },
  {
    icon: <History className="h-4 w-4" />,
    label: 'History',
    content: (
      <div className="space-y-2">
        <div className="text-sm">
          <p className="text-muted-foreground">Status changed to Open</p>
          <p className="text-xs text-muted-foreground">Jan 1, 2024 10:00 AM</p>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">Ticket created</p>
          <p className="text-xs text-muted-foreground">Jan 1, 2024 9:45 AM</p>
        </div>
      </div>
    )
  }
]

export function DetailsPanel({ width }: DetailsPanelProps) {
  return (
    <div 
      className="bg-card rounded-lg border border-border shadow-sm flex flex-col h-full"
      style={{ width: `${width}px` }}
    >
      <Tabs defaultValue="details" className="h-full flex flex-col">
        <div className="flex-none border-b border-border/40">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">
              Details
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex-1">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                AI Copilot
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="flex-1 overflow-y-auto p-4">
          <Accordion type="multiple" defaultValue={['Customer']}>
            {detailSections.map((section) => (
              <AccordionItem key={section.label} value={section.label}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <span>{section.label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="ai" className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div className="bg-accent/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                AI Copilot is ready to help you with this conversation.
                Ask questions or request assistance with tasks.
              </p>
            </div>
            {/* AI chat interface will be added here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
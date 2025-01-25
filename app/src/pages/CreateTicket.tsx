import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'
import { useToast } from '../components/ui/use-toast'
import { api } from '../lib/api'

export default function CreateTicket() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = useAuthStore((state) => state.user)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    try {
      // Create ticket
      const { data: ticket } = await api.post('/api/tickets', {
        subject: formData.get('subject'),
        clientId: user?.id,
      })

      // Create initial message
      await api.post(`/api/tickets/${ticket.id}/messages`, {
        text: formData.get('message'),
        isInternalNote: false,
      })

      toast({
        title: 'Ticket Created',
        description: 'Your ticket has been submitted successfully.',
      })

      // Navigate back to portal
      navigate('/portal')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create ticket. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Create New Ticket
            </CardTitle>
            <CardDescription className="text-base">
              Please provide details about your request and we&apos;ll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Brief description of your issue"
                  className="border-input focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Please provide details about your request"
                  className="min-h-[200px] border-input focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/portal')}
                  className="border-border hover:bg-muted transition-colors duration-200"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-teal-600 hover:bg-teal-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? 'Creating...' : 'Create Ticket'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 

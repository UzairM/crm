/**
 * Dashboard Page Component
 * 
 * Main dashboard interface that adapts based on user role (Agent, Manager, Client).
 * Displays relevant information and actions for each user type.
 * 
 * Features:
 * - Role-based content display
 * - Ticket overview and statistics
 * - Quick actions for ticket management
 * - Real-time updates for ticket status
 * - Performance metrics for Managers
 * 
 * Views by Role:
 * - Agent: Displays assigned tickets, unread messages, and pending tasks
 * - Manager: Shows team performance, SLA metrics, and system health
 * - Client: Presents active tickets and recent communications
 * 
 * @example
 * ```tsx
 * // Protected route in router
 * <ProtectedRoute path="/dashboard">
 *   <Dashboard />
 * </ProtectedRoute>
 * ```
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { BarChart3, Users, Ticket, Settings } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-6">
        {/* Quick stats section */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">123</div>
              <p className="text-xs text-muted-foreground mt-1">+4.5% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground mt-1">+2 new this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Response Time</CardTitle>
              <Settings className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2h</div>
              <p className="text-xs text-muted-foreground mt-1">Avg. over last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground mt-1">+2.1% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription className="text-base">
                Overview of your recent tickets and client interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center rounded-lg bg-muted/5 border border-border/50">
                <p className="text-muted-foreground">Activity timeline coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 

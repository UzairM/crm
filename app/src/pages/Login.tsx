/**
 * Login Page Component
 * 
 * Handles user authentication using ORY's login flow.
 * Integrates with the ORY SDK to provide a secure, customizable login experience.
 * 
 * Features:
 * - Email/password authentication
 * - Error handling and validation
 * - Automatic redirect after successful login
 * - Integration with ORY's authentication flow
 * - Responsive design with neumorphic styling
 * 
 * Flow:
 * 1. Component mounts and initializes ORY login flow
 * 2. User enters credentials
 * 3. On submit, credentials are sent to ORY
 * 4. Success: User is redirected to dashboard
 * 5. Error: Appropriate error message is displayed
 * 
 * @example
 * ```tsx
 * // In router configuration
 * <Route path="/login" element={<Login />} />
 * ```
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ory } from '../lib/ory'
import { useAuthStore } from '../stores/auth'
import type { AxiosError, AxiosResponse } from 'axios'
import type { UiNodeInputAttributes } from '@ory/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription } from "../components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getMe } from '../lib/api'

interface LoginFlowError extends AxiosError {
  response?: AxiosResponse & {
    data: {
      ui: {
        messages?: Array<{
          id: number
          text: string
          type: string
        }>
      }
    }
  }
}

export default function Login() {
  const navigate = useNavigate()
  const { setSession, setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      // First get a login flow
      const { data: flow } = await ory.createBrowserLoginFlow({
        refresh: true
      })

      // Find the CSRF token
      const csrfNode = flow.ui.nodes.find(
        node => 
          node.type === 'input' && 
          (node.attributes as UiNodeInputAttributes).name === 'csrf_token'
      )
      const csrfToken = csrfNode ? (csrfNode.attributes as UiNodeInputAttributes).value : ''

      // Then submit the login flow
      const { data } = await ory.updateLoginFlow({
        flow: flow.id,
        updateLoginFlowBody: {
          identifier: email,
          password,
          method: 'password',
          csrf_token: csrfToken,
        },
      })

      // Store the session data
      if (data.session) {
        setSession(data.session)
        
        // Get user data from core CRM
        try {
          const user = await getMe()
          setUser(user)
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          throw error
        }
      }

      navigate('/dashboard')
    } catch (error: unknown) {
      console.error('Login failed:', error)
      const loginError = error as LoginFlowError
      setError(
        loginError.response?.data?.ui?.messages?.[0]?.text || 
        'Failed to sign in. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
          Invest Smarter, Together
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Your trusted partner in financial management
        </p>
      </div>

      <div className="mt-16 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Welcome</CardTitle>
            <CardDescription className="text-base">Enter your Elphinstone Account credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="border-input focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="border-input focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
            <div className="flex justify-between text-sm mt-6">
              <Link to="/recovery" className="text-foreground hover:underline">
                Forgot Password?
              </Link>
              <Link to="/verification" className="text-foreground hover:underline">
                Verify Email?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
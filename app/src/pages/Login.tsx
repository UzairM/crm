import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ory } from '../lib/ory'
import { useAuthStore } from '../stores/auth'
import { useUIStore } from '../stores/ui'
import type { AxiosError } from 'axios'
import type { UiNodeInputAttributes } from '@ory/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription } from "../components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getMe } from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const setUser = useAuthStore((state) => state.setUser)
  const setSession = useAuthStore((state) => state.setSession)
  const setLoading = useUIStore((state) => state.setLoading)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: session } = await ory.toSession()
        setSession(session)
        
        // Get user data from core CRM
        try {
          const user = await getMe()
          setUser(user)
          navigate('/dashboard')
        } catch (error) {
          console.error('Failed to fetch user data:', error)
        }
      } catch (err) {
        // No existing session
      }
    }
    checkSession()
  }, [navigate, setSession, setUser])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const form = e.currentTarget as HTMLFormElement
      const formData = new FormData(form)
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
          method: 'password',
          identifier: email,
          password,
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
      const axiosError = error as AxiosError<{ error?: { reason?: string } }>
      if (axiosError.response) {
        const status = axiosError.response.status
        const reason = axiosError.response.data?.error?.reason
        setError(reason || `Error ${status}: ${axiosError.message}`)
      } else if (axiosError.request) {
        setError('Network error. Please check your connection.')
      } else {
        setError(axiosError.message || 'An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription className="text-base">Enter your credentials to continue</CardDescription>
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

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200">
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
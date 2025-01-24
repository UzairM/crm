import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ory } from '../lib/ory'
import { useAuthStore } from '../stores/auth'
import { useUIStore } from '../stores/ui'
import type { AxiosError } from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

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
        navigate('/dashboard')
      } catch (err) {
        // No existing session
      }
    }
    checkSession()
  }, [navigate, setSession])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      // First get a login flow
      const { data: flow } = await ory.createBrowserLoginFlow()

      // Then submit the login flow
      const { data } = await ory.updateLoginFlow({
        flow: flow.id,
        updateLoginFlowBody: {
          method: 'password',
          identifier: email,
          password,
          csrf_token: flow.ui.nodes.find(
            node => node.attributes.node_type === 'input' && 
              node.attributes.name === 'csrf_token'
          )?.attributes?.value || '',
        },
      })

      // Store the session data
      if (data.session) {
        setSession(data.session)
        if (data.session.identity) {
          const traits = data.session.identity.traits as { email: string }
          setUser({
            id: data.session.identity.id,
            email: traits.email,
            role: 'None',
            fullName: null,
            isActive: true,
          })
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
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
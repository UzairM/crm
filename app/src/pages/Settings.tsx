/**
 * Settings Page Component
 * 
 * Configuration interface for system-wide settings and user preferences.
 * Provides role-based access to different settings sections.
 * 
 * Features:
 * - User profile management
 * - System configuration (Manager only)
 * - SLA settings management
 * - Notification preferences
 * - Theme customization
 * 
 * Settings Sections:
 * 1. Profile
 *    - Personal information
 *    - Password change
 *    - Contact preferences
 * 
 * 2. System (Manager only)
 *    - SLA configuration
 *    - Role management
 *    - System defaults
 * 
 * 3. Notifications
 *    - Email preferences
 *    - In-app notifications
 *    - Alert thresholds
 * 
 * 4. Display
 *    - Theme selection
 *    - Layout options
 *    - Language preferences
 * 
 * @example
 * ```tsx
 * // Basic settings route
 * <Route path="/settings" element={<Settings />} />
 * 
 * // With specific section
 * <Settings defaultSection="profile" />
 * ```
 */

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useAuthStore } from '../stores/auth'
import { ory } from '../lib/ory'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Alert, AlertDescription } from "../components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import type { UiNodeInputAttributes, UpdateSettingsFlowBody, SettingsFlow, UiNode } from '@ory/client'
import type { AxiosError, AxiosResponse } from 'axios'
import { validatePassword } from '../lib/utils'
import { PasswordRequirements } from '../components/ui/PasswordRequirements'

interface Identity {
  id: string
  email: string
  phone?: string
}

interface SettingsFlowError extends AxiosError {
  response?: AxiosResponse & {
    data: SettingsFlow
  }
}

export default function Settings() {
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const session = useAuthStore((state) => state.session)

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        if (session?.identity) {
          setIdentity({
            id: session.identity.id,
            email: session.identity.traits.email,
            phone: session.identity.traits.phone || undefined
          })
        }
      } catch (error) {
        console.error('Failed to fetch identity:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIdentity()
  }, [session])

  // Scroll to password section if hash is present
  useEffect(() => {
    if (window.location.hash === '#password-change') {
      const passwordSection = document.getElementById('password-change')
      if (passwordSection) {
        passwordSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match")
      return
    }

    const validation = validatePassword(newPassword)
    if (!validation.isValid) {
      setPasswordError(validation.error)
      return
    }

    setIsChangingPassword(true)

    try {
      // Get the settings flow
      const { data: flow } = await ory.createBrowserSettingsFlow()

      // Find the CSRF token
      const csrfNode = flow.ui.nodes.find(
        node => 
          node.type === 'input' && 
          (node.attributes as UiNodeInputAttributes).name === 'csrf_token'
      )
      const csrfToken = csrfNode ? (csrfNode.attributes as UiNodeInputAttributes).value : ''

      // Update the password
      const { data } = await ory.updateSettingsFlow({
        flow: flow.id,
        updateSettingsFlowBody: {
          method: 'password',
          password: newPassword,
          csrf_token: csrfToken,
        } as UpdateSettingsFlowBody,
      })

      // Check for success message
      const messages = data.ui.messages || []
      if (messages.length > 0) {
        const message = messages[0]
        if (message.type === 'success') {
          setPasswordSuccess(true)
          setNewPassword('')
          setConfirmPassword('')
          return
        }
      }

      // Check for error message in password node
      const passwordNode = data.ui.nodes.find(node => node.group === 'password')
      const passwordMessages = passwordNode?.messages || []
      if (passwordMessages.length > 0) {
        setPasswordError(passwordMessages[0].text)
        return
      }

    } catch (error) {
      console.error('Failed to change password:', error)
      const settingsError = error as SettingsFlowError
      
      // Try to get error message from ORY response
      if (settingsError.response?.data?.ui?.messages?.[0]?.text) {
        setPasswordError(settingsError.response.data.ui.messages[0].text)
      } else if (settingsError.response?.data?.ui?.nodes) {
        // Look for error in password node
        const passwordNode = settingsError.response.data.ui.nodes.find(
          (node: UiNode) => node.group === 'password' && node.messages?.length > 0
        )
        if (passwordNode?.messages?.[0]?.text) {
          setPasswordError(passwordNode.messages[0].text)
        } else {
          setPasswordError('Failed to change password. Please try again.')
        }
      } else {
        setPasswordError('Failed to change password. Please try again.')
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold text-foreground mb-8">Settings</h1>
      
      <div className="space-y-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your personal information from your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Email</div>
              <div className="text-foreground">{identity?.email}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Phone</div>
              <div className="text-foreground">{identity?.phone || 'Not provided'}</div>
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card id="password-change">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
              {passwordError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
              {passwordSuccess && (
                <Alert className="bg-emerald-50 text-emerald-900 border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-800">
                    Password changed successfully
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="flex flex-col">
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    className="border-input focus:ring-2 focus:ring-ring w-full"
                    required
                    minLength={8}
                    placeholder="Enter a strong password"
                  />
                  <PasswordRequirements 
                    password={newPassword} 
                    isVisible={isPasswordFocused || newPassword.length > 0}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-input focus:ring-2 focus:ring-ring w-full"
                  required
                  minLength={8}
                  placeholder="Re-enter your password"
                />
              </div>
              <Button 
                type="submit"
                disabled={isChangingPassword}
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
              >
                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 

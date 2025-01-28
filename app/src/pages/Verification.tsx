/**
 * Email Verification Page Component
 * 
 * Handles the email verification flow using ORY's verification feature.
 * Ensures users verify their email addresses for account security.
 * 
 * Features:
 * - Email verification flow
 * - Resend verification option
 * - Token validation
 * - Error handling
 * - Success confirmation
 * 
 * Flow Steps:
 * 1. User receives verification email
 * 2. Clicks verification link
 * 3. Lands on this page
 * 4. System validates verification token
 * 5. Updates verification status
 * 6. Redirects to appropriate page
 * 
 * States:
 * - Pending: Waiting for token validation
 * - Success: Email verified
 * - Error: Invalid/expired token
 * - Resend: New verification email requested
 * 
 * @example
 * ```tsx
 * // In router configuration
 * <Route path="/verification" element={<Verification />} />
 * 
 * // With success redirect
 * <Verification redirectTo="/dashboard" />
 * ```
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { LoadingSpinner } from '../components/LoadingSpinner'
import { EmailForm } from '../components/verification/EmailForm'
import { CodeVerificationForm } from '../components/verification/CodeVerificationForm'
import { ResendTimer } from '../components/verification/ResendTimer'
import { ory } from '../lib/ory'
import { useToast } from '../components/ui/use-toast'
import type { UpdateVerificationFlowBody, VerificationFlow, UiNodeInputAttributes } from '@ory/client'
import type { AxiosError, AxiosResponse } from 'axios'

interface VerificationFlowError extends AxiosError {
  response?: AxiosResponse & {
    data: VerificationFlow
  }
}

export default function Verification() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [flowId, setFlowId] = useState<string | null>(null)
  const [step, setStep] = useState<'email' | 'code'>('email')

  useEffect(() => {
    const initializeFlow = async () => {
      try {
        const { data } = await ory.createBrowserVerificationFlow()
        setFlowId(data.id)
      } catch (error) {
        console.error('Failed to initialize verification flow:', error)
        setError('Failed to initialize verification flow. Please try again.')
      }
    }

    initializeFlow()
  }, [])

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!flowId) return

    setError(null)
    setIsLoading(true)

    try {
      // Find the CSRF token
      const { data: flow } = await ory.getVerificationFlow({ id: flowId })
      const csrfNode = flow.ui.nodes.find(
        node => 
          node.type === 'input' && 
          (node.attributes as UiNodeInputAttributes).name === 'csrf_token'
      )
      const csrfToken = csrfNode ? (csrfNode.attributes as UiNodeInputAttributes).value : ''

      await ory.updateVerificationFlow({
        flow: flowId,
        updateVerificationFlowBody: {
          email,
          method: 'code',
          csrf_token: csrfToken,
        } as UpdateVerificationFlowBody,
      })

      setStep('code')
    } catch (error: unknown) {
      console.error('Failed to send verification code:', error)
      const verificationError = error as VerificationFlowError
      setError(verificationError.response?.data?.ui?.messages?.[0]?.text || 'Failed to send verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!flowId) return

    const verificationCode = code.join('')
    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits of the verification code')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      // Find the CSRF token
      const { data: flow } = await ory.getVerificationFlow({ id: flowId })
      const csrfNode = flow.ui.nodes.find(
        node => 
          node.type === 'input' && 
          (node.attributes as UiNodeInputAttributes).name === 'csrf_token'
      )
      const csrfToken = csrfNode ? (csrfNode.attributes as UiNodeInputAttributes).value : ''

      await ory.updateVerificationFlow({
        flow: flowId,
        updateVerificationFlowBody: {
          code: verificationCode,
          method: 'code',
          csrf_token: csrfToken,
        } as UpdateVerificationFlowBody,
      })

      // Check for error messages in the response
      const { data: updatedFlow } = await ory.getVerificationFlow({ id: flowId })
      const messages = updatedFlow.ui.messages || []
      if (messages.length > 0) {
        const errorMessage = messages[0]
        if (errorMessage.type === 'error') {
          setError(errorMessage.text)
          // Clear the code on error
          setCode(['', '', '', '', '', ''])
          return
        }
      }

      // If no errors, show success message
      toast({
        title: "Email Verified Successfully!",
        description: "Your email has been verified. You can now log in.",
        duration: 3000,
      })

      // Wait for toast to be visible before redirecting
      await new Promise(resolve => setTimeout(resolve, 3000))
      navigate('/login')
    } catch (error: unknown) {
      console.error('Failed to verify code:', error)
      const verificationError = error as VerificationFlowError
      setError(verificationError.response?.data?.ui?.messages?.[0]?.text || 'Invalid verification code. Please try again.')
      // Clear the code on error
      setCode(['', '', '', '', '', ''])
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!flowId) return
    setIsResending(true)
    setError(null)

    try {
      // Find the CSRF token
      const { data: flow } = await ory.getVerificationFlow({ id: flowId })
      const csrfNode = flow.ui.nodes.find(
        node => 
          node.type === 'input' && 
          (node.attributes as UiNodeInputAttributes).name === 'csrf_token'
      )
      const csrfToken = csrfNode ? (csrfNode.attributes as UiNodeInputAttributes).value : ''

      await ory.updateVerificationFlow({
        flow: flowId,
        updateVerificationFlowBody: {
          email,
          method: 'code',
          csrf_token: csrfToken,
        } as UpdateVerificationFlowBody,
      })

      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
        duration: 3000,
      })

      // Clear the previous code
      setCode(['', '', '', '', '', ''])
    } catch (error: unknown) {
      console.error('Failed to resend code:', error)
      const verificationError = error as VerificationFlowError
      setError(verificationError.response?.data?.ui?.messages?.[0]?.text || 'Failed to resend code. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  if (!flowId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            {step === 'email' 
              ? 'Enter your email to receive a verification code'
              : `Enter the verification code sent to your email: ${email}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' ? (
            <EmailForm
              email={email}
              setEmail={setEmail}
              onSubmit={handleSubmitEmail}
              isLoading={isLoading}
              error={error}
              submitText="Send Verification Code"
              loadingText="Sending Code..."
            />
          ) : (
            <>
              <CodeVerificationForm
                code={code}
                setCode={setCode}
                onSubmit={handleSubmitCode}
                isLoading={isLoading}
                error={error}
                submitText="Verify Email"
                loadingText="Verifying..."
              />
              <ResendTimer onResend={handleResendCode} isResending={isResending} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
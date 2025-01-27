import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { AlertCircle } from "lucide-react"
import { LoadingSpinner } from '../components/LoadingSpinner'
import { EmailForm } from '../components/verification/EmailForm'
import { CodeVerificationForm } from '../components/verification/CodeVerificationForm'
import { ResendTimer } from '../components/verification/ResendTimer'
import { ory } from '../lib/ory'
import { useToast } from '../components/ui/use-toast'
import type { UpdateRecoveryFlowBody, RecoveryFlow, UiNodeInputAttributes } from '@ory/client'
import type { AxiosError, AxiosResponse } from 'axios'

interface RecoveryFlowError extends AxiosError {
  response?: AxiosResponse & {
    data: RecoveryFlow
  }
}

export default function Recovery() {
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
        const { data } = await ory.createBrowserRecoveryFlow()
        setFlowId(data.id)
      } catch (error) {
        console.error('Failed to initialize recovery flow:', error)
        setError('Failed to initialize recovery flow. Please try again.')
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
      const { data: flow } = await ory.getRecoveryFlow({ id: flowId })
      const csrfNode = flow.ui.nodes.find(
        node => 
          node.type === 'input' && 
          (node.attributes as UiNodeInputAttributes).name === 'csrf_token'
      )
      const csrfToken = csrfNode ? (csrfNode.attributes as UiNodeInputAttributes).value : ''

      await ory.updateRecoveryFlow({
        flow: flowId,
        updateRecoveryFlowBody: {
          email,
          method: 'code',
          csrf_token: csrfToken,
        } as UpdateRecoveryFlowBody,
      })

      setStep('code')
    } catch (error: unknown) {
      console.error('Failed to send recovery code:', error)
      const recoveryError = error as RecoveryFlowError
      setError(recoveryError.response?.data?.ui?.messages?.[0]?.text || 'Failed to send recovery code. Please try again.')
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
      const { data: flow } = await ory.getRecoveryFlow({ id: flowId })
      const csrfNode = flow.ui.nodes.find(
        node => 
          node.type === 'input' && 
          (node.attributes as UiNodeInputAttributes).name === 'csrf_token'
      )
      const csrfToken = csrfNode ? (csrfNode.attributes as UiNodeInputAttributes).value : ''

      await ory.updateRecoveryFlow({
        flow: flowId,
        updateRecoveryFlowBody: {
          code: verificationCode,
          method: 'code',
          csrf_token: csrfToken,
        } as UpdateRecoveryFlowBody,
      })

      // Check for error messages in the response
      const { data: updatedFlow } = await ory.getRecoveryFlow({ id: flowId })
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

      // If no errors, redirect to password change
      navigate('/settings#password-change')
    } catch (error: unknown) {
      console.error('Failed to verify recovery code:', error)
      const recoveryError = error as RecoveryFlowError
      setError(recoveryError.response?.data?.ui?.messages?.[0]?.text || 'Invalid recovery code. Please try again.')
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
      const { data: flow } = await ory.getRecoveryFlow({ id: flowId })
      const csrfNode = flow.ui.nodes.find(
        node => 
          node.type === 'input' && 
          (node.attributes as UiNodeInputAttributes).name === 'csrf_token'
      )
      const csrfToken = csrfNode ? (csrfNode.attributes as UiNodeInputAttributes).value : ''

      await ory.updateRecoveryFlow({
        flow: flowId,
        updateRecoveryFlowBody: {
          email,
          method: 'code',
          csrf_token: csrfToken,
        } as UpdateRecoveryFlowBody,
      })

      toast({
        title: "Code Resent",
        description: "A new recovery code has been sent to your email.",
        duration: 3000,
      })

      // Clear the previous code
      setCode(['', '', '', '', '', ''])
    } catch (error: unknown) {
      console.error('Failed to resend code:', error)
      const recoveryError = error as RecoveryFlowError
      setError(recoveryError.response?.data?.ui?.messages?.[0]?.text || 'Failed to resend code. Please try again.')
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
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            {step === 'email' 
              ? 'Enter your email to receive a recovery code'
              : `Enter the recovery code sent to your email: ${email}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {step === 'email' ? (
            <EmailForm
              email={email}
              setEmail={setEmail}
              onSubmit={handleSubmitEmail}
              isLoading={isLoading}
              error={error}
              submitText="Send Recovery Code"
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
                submitText="Reset Password"
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

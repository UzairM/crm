/**
 * Global error boundary component that catches and handles unhandled errors.
 * Provides a fallback UI when errors occur and prevents app crashes.
 * 
 * @component
 * @example
 * ```tsx
 * <GlobalErrorBoundary>
 *   <App />
 * </GlobalErrorBoundary>
 * ```
 */

import { Component, ErrorInfo, ReactNode } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

/**
 * Props for the GlobalErrorBoundary component
 * @interface
 */
interface Props {
  /** Child components that this error boundary wraps */
  children: ReactNode;
}

/**
 * State for the GlobalErrorBoundary component
 * @interface
 */
interface State {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error message if an error occurred */
  error?: Error;
}

/**
 * Fallback component rendered when an error occurs
 * @param {FallbackProps} props - Component props from react-error-boundary
 */
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p className="font-medium mb-2">Error:</p>
          <pre className="text-sm whitespace-pre-wrap">{error.message}</pre>
        </div>
        {import.meta.env.DEV && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium mb-2">Stack trace:</p>
            <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-[200px]">
              {error.stack}
            </pre>
          </div>
        )}
        <button
          onClick={resetErrorBoundary}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

/**
 * Global error boundary class component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  /**
   * Lifecycle method called when an error occurs
   * Updates state to trigger fallback UI
   * @param {Error} error - The error that was thrown
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  /**
   * Lifecycle method called after an error is caught
   * Used for error logging
   * @param {Error} error - The error that was thrown
   * @param {ErrorInfo} errorInfo - Additional error information
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    return (
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // Reset any state that might have caused the error
          window.location.href = '/'
        }}
      >
        {this.props.children}
      </ErrorBoundary>
    )
  }
} 
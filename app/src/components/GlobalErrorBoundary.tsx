import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
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

export function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset any state that might have caused the error
        window.location.href = '/'
      }}
    >
      {children}
    </ErrorBoundary>
  )
} 
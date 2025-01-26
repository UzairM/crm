import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary'

// Enable better stack traces in development
if (import.meta.env.DEV) {
  Error.stackTraceLimit = Infinity
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalErrorBoundary>
  </StrictMode>
) 
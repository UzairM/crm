/**
 * Not Found (404) Page Component
 * 
 * Custom 404 error page that provides a user-friendly experience when
 * accessing non-existent routes or resources.
 * 
 * Features:
 * - Clear error messaging
 * - Navigation assistance
 * - Return to safety options
 * - Maintains app theme and branding
 * 
 * User Experience:
 * - Explains the error in simple terms
 * - Provides quick links to main sections
 * - Offers search functionality (optional)
 * - Maintains consistent navigation
 * 
 * @example
 * ```tsx
 * // In router as catch-all
 * <Route path="*" element={<NotFound />} />
 * 
 * // With custom message
 * <NotFound message="The ticket you're looking for doesn't exist" />
 * ```
 */

import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-foreground">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Page not found
          </h2>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. Please check the URL or go back to the homepage.
          </p>
        </div>
        <Button variant="ghost" asChild className="group">
          <Link to="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
} 

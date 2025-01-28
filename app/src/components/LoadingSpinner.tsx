/**
 * A simple animated loading spinner component.
 * Uses Lucide's Loader2 icon with a spinning animation.
 * Useful for indicating loading states in the application.
 * 
 * @component
 * @example
 * ```tsx
 * <LoadingSpinner />
 * ```
 */

import { Loader2 } from 'lucide-react'

export function LoadingSpinner() {
  return <Loader2 className="h-6 w-6 animate-spin" />
} 
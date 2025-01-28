/**
 * Custom hook to check if the auth store has been hydrated from localStorage
 * Used to prevent hydration mismatches and ensure auth state is ready
 * 
 * @returns boolean indicating if the auth store has been hydrated
 * 
 * @example
 * ```tsx
 * const Component = () => {
 *   const isHydrated = useHydrated()
 *   
 *   if (!isHydrated) {
 *     return <LoadingSpinner /> // Show loading state until hydration complete
 *   }
 *   
 *   return <AuthenticatedContent />
 * }
 * ```
 */
import { useAuthStore } from '../stores/auth'

export const useHydrated = () => useAuthStore((state) => state.isHydrated) 
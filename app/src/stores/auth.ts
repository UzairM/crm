/**
 * Authentication store using Zustand with persistence.
 * Manages user session state and local user data.
 * Integrates with ORY for authentication and local CRM for user roles.
 * 
 * Features:
 * - Persistent session storage
 * - Hydration state tracking
 * - ORY session management
 * - Local user data caching
 * 
 * @example
 * ```tsx
 * // Using the auth store
 * const { user, session, setUser, setSession } = useAuthStore()
 * 
 * // Check if user is authenticated
 * if (session && user) {
 *   // User is logged in
 * }
 * 
 * // Update user data
 * setUser({
 *   id: '123',
 *   email: 'user@example.com',
 *   role: 'Agent',
 *   fullName: 'John Doe',
 *   isActive: true
 * })
 * 
 * // Reset auth state (logout)
 * useAuthStore.getState().resetState()
 * ```
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Session } from '@ory/client'

/**
 * User interface representing local CRM user data
 * Maps to the user table in the Core CRM service
 */
export interface User {
  /** Unique identifier from the CRM */
  id: string
  /** User's email address (matches ORY identity) */
  email: string
  /** Local role (Agent, Manager, Client) */
  role: string
  /** Optional display name */
  fullName: string | null
  /** Whether the user is allowed to access the system */
  isActive: boolean
}

/**
 * Authentication state interface
 * Combines ORY session data with local user information
 */
export interface AuthState {
  /** Current ORY session */
  session: Session | null
  /** Local user data from CRM */
  user: User | null
  /** Whether the store has been hydrated from persistence */
  isHydrated: boolean
  /** Update the current session */
  setSession: (session: Session | null) => void
  /** Update local user data */
  setUser: (user: User | null) => void
  /** Update hydration state */
  setHydrated: (state: boolean) => void
  /** Reset all auth state (used for logout) */
  resetState: () => void
}

/**
 * Main authentication store
 * Uses Zustand persist middleware to maintain state across page reloads
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      isHydrated: false,
      setSession: (session) => set({ session }),
      setUser: (user) => set({ user }),
      setHydrated: (state) => set({ isHydrated: state }),
      resetState: () => set({ session: null, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
) 

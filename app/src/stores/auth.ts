import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { Session } from '@ory/client'

export interface User {
  id: string
  email: string
  role: string
  fullName: string | null
  isActive: boolean
}

export interface AuthState {
  session: Session | null
  user: User | null
  setSession: (session: Session | null) => void
  setUser: (user: User | null) => void
  resetState: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        session: null,
        user: null,
        setSession: (session) => set({ session }),
        setUser: (user) => set({ user }),
        resetState: () => set({ session: null, user: null }),
      }),
      {
        name: 'auth-storage',
      }
    )
  )
) 

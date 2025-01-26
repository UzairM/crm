import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
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
  isHydrated: boolean
  setSession: (session: Session | null) => void
  setUser: (user: User | null) => void
  setHydrated: (state: boolean) => void
  resetState: () => void
}

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

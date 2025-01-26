import { useAuthStore } from '../stores/auth'

export function useHydrated() {
  return useAuthStore((state) => state.isHydrated)
} 
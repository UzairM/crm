/**
 * Theme management store using Zustand with persistence.
 * Handles light/dark theme switching with localStorage persistence.
 * 
 * Features:
 * - Persistent theme preference
 * - Light/dark theme toggle
 * - Direct theme setting
 * 
 * @example
 * ```tsx
 * // Using theme store
 * const { theme, toggleTheme, setTheme } = useThemeStore()
 * 
 * // Toggle between light/dark
 * toggleTheme()
 * 
 * // Set specific theme
 * setTheme('dark')
 * 
 * // Check current theme
 * if (theme === 'dark') {
 *   // Apply dark theme styles
 * }
 * ```
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Theme store state and actions interface
 */
type ThemeStore = {
  /** Current theme ('light' or 'dark') */
  theme: 'dark' | 'light'
  /** Toggle between light and dark themes */
  toggleTheme: () => void
  /** Set a specific theme */
  setTheme: (theme: 'dark' | 'light') => void
}

/**
 * Main theme store with persistence
 * Uses localStorage to remember user's theme preference
 */
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
) 
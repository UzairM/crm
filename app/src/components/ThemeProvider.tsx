/**
 * Theme provider component that manages application-wide theme state.
 * Handles theme switching between light and dark modes using CSS classes.
 * 
 * @component
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */

import { useEffect } from 'react'
import { useThemeStore } from '../stores/theme'

/**
 * Props for the ThemeProvider component
 * @interface
 */
interface ThemeProviderProps {
  /** Child components that will have access to theme context */
  children: React.ReactNode;
}

/**
 * Theme provider component that manages theme switching
 * Uses CSS classes to toggle between light and dark themes
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useThemeStore()

  /**
   * Effect to update document root class when theme changes
   */
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
} 
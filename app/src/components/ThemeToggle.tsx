/**
 * A button component that toggles between light and dark themes.
 * Uses Lucide icons to show sun/moon based on current theme state.
 * Includes proper accessibility labels and smooth transitions.
 * 
 * @component
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */

import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { useThemeStore } from '../stores/theme'

export function ThemeToggle() {
  const { toggleTheme } = useThemeStore()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 transition-all duration-200"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 

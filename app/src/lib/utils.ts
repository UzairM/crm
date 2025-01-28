/**
 * Utility Functions
 * 
 * Collection of utility functions for common operations in the application.
 * Currently focused on class name management for styling components.
 * 
 * Features:
 * - Class name merging with Tailwind support
 * - Conflict resolution for Tailwind classes
 * - Type-safe class value handling
 * 
 * @example
 * ```tsx
 * import { cn } from '@/lib/utils'
 * 
 * // Merge multiple class names with Tailwind
 * const className = cn(
 *   'base-class',
 *   isActive && 'active-class',
 *   'p-4 hover:bg-gray-100',
 *   props.className
 * )
 * ```
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names with Tailwind support
 * Combines clsx for conditional classes with tailwind-merge for 
 * proper handling of Tailwind CSS classes
 * 
 * @param inputs - Array of class values to merge
 * @returns Merged class string with resolved Tailwind conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates password strength against security requirements
 * 
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (!@#$%^&*(),.?":{}|<>)
 * 
 * @param password - The password string to validate
 * @returns Object containing validation result
 *          - isValid: boolean indicating if password meets all requirements
 *          - error: string message if validation fails, null if passes
 * 
 * @example
 * ```ts
 * const { isValid, error } = validatePassword('weakpass')
 * if (!isValid) {
 *   console.error(error) // "Password must include an uppercase letter"
 * }
 * 
 * // Valid password
 * validatePassword('StrongP@ss123') // { isValid: true, error: null }
 * ```
 */
export function validatePassword(password: string): { isValid: boolean; error: string | null } {
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' }
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must include an uppercase letter' }
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must include a lowercase letter' }
  }

  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must include a number' }
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: 'Password must include a symbol (!@#$%^&*(),.?":{}|<>)' }
  }

  return { isValid: true, error: null }
}

/**
 * Global UI state management store using Zustand.
 * Handles common UI states like loading, errors, and modals.
 * Includes dev tools for better debugging experience.
 * 
 * Features:
 * - Global loading state
 * - Error message handling
 * - Modal management
 * - Dev tools integration
 * 
 * @example
 * ```tsx
 * // Using loading state
 * const { isLoading, setLoading } = useUIStore()
 * 
 * // Show loading during async operation
 * setLoading(true)
 * await someAsyncOperation()
 * setLoading(false)
 * 
 * // Error handling
 * const { setError } = useUIStore()
 * try {
 *   await riskyOperation()
 * } catch (err) {
 *   setError(err.message)
 * }
 * 
 * // Modal management
 * const { openModal, closeModal } = useUIStore()
 * openModal(<CustomModalContent />)
 * 
 * // Reset all UI state
 * useUIStore.getState().resetState()
 * ```
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

/**
 * UI state interface for global UI state management
 */
export interface UIState {
  /** Global loading indicator state */
  isLoading: boolean
  /** Global error message */
  error: string | null
  /** Whether a modal is currently displayed */
  isModalOpen: boolean
  /** Content to be displayed in the modal */
  modalContent: React.ReactNode | null
  /** Set the global loading state */
  setLoading: (isLoading: boolean) => void
  /** Set a global error message */
  setError: (error: string | null) => void
  /** Open a modal with the given content */
  openModal: (content: React.ReactNode) => void
  /** Close the currently open modal */
  closeModal: () => void
  /** Reset all UI state to defaults */
  resetState: () => void
}

/**
 * Main UI store with dev tools middleware
 * Provides global UI state management
 */
export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isLoading: false,
      error: null,
      isModalOpen: false,
      modalContent: null,
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
      openModal: (content: React.ReactNode) => set({ isModalOpen: true, modalContent: content }),
      closeModal: () => set({ isModalOpen: false, modalContent: null }),
      resetState: () => set({ isLoading: false, error: null, isModalOpen: false, modalContent: null }),
    }),
    {
      name: 'ui-store',
    }
  )
) 

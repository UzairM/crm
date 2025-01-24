import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface UIState {
  isLoading: boolean
  error: string | null
  isModalOpen: boolean
  modalContent: React.ReactNode | null
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  openModal: (content: React.ReactNode) => void
  closeModal: () => void
  resetState: () => void
}

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

/**
 * A reusable modal dialog component that uses Zustand for state management.
 * Uses Shadcn's Dialog component for consistent styling and accessibility.
 * The modal content and visibility are controlled through the UI store.
 * 
 * @component
 * @example
 * ```tsx
 * // In your component:
 * const openModal = useUIStore((state) => state.openModal)
 * 
 * // To open the modal:
 * openModal(<div>Your modal content here</div>)
 * 
 * // The Modal component itself should be rendered at the root level:
 * <Modal />
 * ```
 */

import { useUIStore } from '../stores/ui'
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from './ui/dialog'
import { Button } from './ui/button'

export function Modal() {
  const isOpen = useUIStore((state) => state.isModalOpen)
  const content = useUIStore((state) => state.modalContent)
  const closeModal = useUIStore((state) => state.closeModal)

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        {content}
        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 

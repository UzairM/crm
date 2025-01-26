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

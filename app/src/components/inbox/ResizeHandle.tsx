import { forwardRef } from 'react'

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export const ResizeHandle = forwardRef<HTMLDivElement, ResizeHandleProps>(
  ({ onMouseDown, onKeyDown }, ref) => (
    <div
      ref={ref}
      role="presentation"
      className="w-1 hover:bg-primary/20 cursor-col-resize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
    />
  )
)

ResizeHandle.displayName = 'ResizeHandle' 
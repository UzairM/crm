import { useState, useRef } from 'react'

export function useResizePanel(initialWidth: number = 400) {
  const [width, setWidth] = useState(initialWidth)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.clientX
    startWidth.current = width
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return
    const delta = startX.current - e.clientX
    const newWidth = Math.min(Math.max(300, startWidth.current + delta), 600)
    setWidth(newWidth)
  }

  const handleMouseUp = () => {
    isDragging.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setWidth(w => Math.max(300, w - 10))
    } else if (e.key === 'ArrowRight') {
      setWidth(w => Math.min(600, w + 10))
    }
  }

  return {
    width,
    handleMouseDown,
    handleKeyDown
  }
} 
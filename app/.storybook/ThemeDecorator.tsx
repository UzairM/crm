import React from 'react'

export const ThemeDecorator = (Story: React.ComponentType) => {
  return (
    <div className="min-h-screen bg-background p-8 antialiased [&:has(dialog[open])]:bg-background/50">
      <div className="relative">
        <Story />
      </div>
    </div>
  )
} 
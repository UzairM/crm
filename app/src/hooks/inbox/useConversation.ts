import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useConversation() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize filters from URL or defaults
  const [filter, setFilter] = useState(() => {
    return searchParams.get('status')?.toUpperCase() || 'OPEN'
  })
  
  const [unread, setUnread] = useState(() => {
    return searchParams.get('unread') === 'true'
  })

  // Update URL when status filter changes
  const handleFilterChange = (value: string) => {
    setFilter(value)
    const params = new URLSearchParams(searchParams)
    if (value === 'ALL') {
      params.delete('status')
    } else {
      params.set('status', value)
    }
    setSearchParams(params)
  }

  // Toggle unread filter
  const handleUnreadToggle = () => {
    const newUnread = !unread
    setUnread(newUnread)
    
    const params = new URLSearchParams(searchParams)
    
    if (newUnread) {
      params.set('unread', 'true')
    } else {
      params.delete('unread')
    }
    
    // Keep the current status if it exists
    const currentStatus = searchParams.get('status')
    if (currentStatus && currentStatus !== 'ALL') {
      params.set('status', currentStatus)
    }
    
    setSearchParams(params, { replace: true })
  }

  // Sync filters with URL on mount and when URL changes
  useEffect(() => {
    const status = searchParams.get('status')?.toUpperCase()
    const urlUnread = searchParams.get('unread') === 'true'
    
    if (status) {
      setFilter(status)
    }
    setUnread(urlUnread)
  }, [searchParams])

  return {
    selectedConversation,
    setSelectedConversation,
    filter,
    unread,
    handleFilterChange,
    handleUnreadToggle
  }
} 
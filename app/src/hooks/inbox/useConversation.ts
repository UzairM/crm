import { useState } from 'react'

export function useConversation() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [filter, setFilter] = useState('4 Open')
  const [sortBy, setSortBy] = useState('Newest')

  const handleFilterChange = () => {
    setFilter(prev => prev === '4 Open' ? 'All' : '4 Open')
  }

  const handleSortChange = () => {
    setSortBy(prev => prev === 'Newest' ? 'Oldest' : 'Newest')
  }

  return {
    selectedConversation,
    setSelectedConversation,
    filter,
    sortBy,
    handleFilterChange,
    handleSortChange
  }
} 
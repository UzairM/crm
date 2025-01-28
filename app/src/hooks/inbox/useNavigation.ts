import { useState } from 'react'
import { useLocation } from 'react-router-dom'

export function useNavigation() {
  const [isNavExpanded, setIsNavExpanded] = useState(true)
  const location = useLocation()
  const isInbox = location.pathname === '/inbox'

  const toggleNav = () => setIsNavExpanded(!isNavExpanded)

  return {
    isNavExpanded,
    toggleNav,
    isInbox
  }
} 
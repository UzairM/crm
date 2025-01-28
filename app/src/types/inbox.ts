import { ReactNode } from 'react'

export interface NavItem {
  icon: ReactNode
  label: string
  count?: number
  href: string
}

export interface DetailSection {
  icon: ReactNode
  label: string
  content?: ReactNode
  defaultOpen?: boolean
  sections?: DetailSection[]
}

export interface Conversation {
  id: string
  title: string
  preview: string
  time: string
  type: 'messenger' | 'email' | 'whatsapp' | 'phone'
  avatar: {
    letter: string
    color: string
  }
  status: 'active' | 'inactive'
} 
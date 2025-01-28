import { createElement } from 'react'
import {
  Mail,
  AtSign,
  PenSquare,
  Users,
  UserMinus,
  LayoutDashboard,
  MessagesSquare,
  Phone,
  Ticket
} from 'lucide-react'
import { NavItem, Conversation } from '../types/inbox'

export const navItems: NavItem[] = [
  {
    icon: createElement(Mail, { className: "h-4 w-4" }),
    label: 'Your inbox',
    count: 4,
    href: '/inbox'
  },
  {
    icon: createElement(AtSign, { className: "h-4 w-4" }),
    label: 'Mentions',
    count: 0,
    href: '/inbox/mentions'
  },
  {
    icon: createElement(PenSquare, { className: "h-4 w-4" }),
    label: 'Created by you',
    count: 0,
    href: '/inbox/created'
  },
  {
    icon: createElement(Users, { className: "h-4 w-4" }),
    label: 'All',
    count: 4,
    href: '/inbox/all'
  },
  {
    icon: createElement(UserMinus, { className: "h-4 w-4" }),
    label: 'Unassigned',
    count: 0,
    href: '/inbox/unassigned'
  },
  {
    icon: createElement(LayoutDashboard, { className: "h-4 w-4" }),
    label: 'Dashboard',
    href: '/inbox/dashboard'
  }
]

export const viewItems: NavItem[] = [
  {
    icon: createElement(MessagesSquare, { className: "h-4 w-4" }),
    label: 'Messenger',
    count: 1,
    href: '/inbox/messenger'
  },
  {
    icon: createElement(Mail, { className: "h-4 w-4" }),
    label: 'Email',
    count: 1,
    href: '/inbox/email'
  },
  {
    icon: createElement(Phone, { className: "h-4 w-4" }),
    label: 'Phone & SMS',
    count: 1,
    href: '/inbox/phone'
  },
  {
    icon: createElement(Ticket, { className: "h-4 w-4" }),
    label: 'Tickets',
    count: 0,
    href: '/inbox/tickets'
  }
]

export const demoConversations: Conversation[] = [
  {
    id: '1',
    title: 'Messenger [Demo]',
    preview: 'Install Messenger',
    time: '1h',
    type: 'messenger',
    avatar: {
      letter: 'M',
      color: 'bg-blue-500'
    },
    status: 'active'
  },
  {
    id: '2',
    title: 'Email [Demo]',
    preview: 'This is a demo email. It shows how a customer conversation from the Messenger will look in your Inbox.',
    time: '1h',
    type: 'email',
    avatar: {
      letter: 'E',
      color: 'bg-green-500'
    },
    status: 'active'
  },
  {
    id: '3',
    title: 'WhatsApp [Demo]',
    preview: 'Set up WhatsApp or social channels',
    time: '1h',
    type: 'whatsapp',
    avatar: {
      letter: 'W',
      color: 'bg-emerald-500'
    },
    status: 'active'
  },
  {
    id: '4',
    title: 'Phone [Demo]',
    preview: 'Set up phone or SMS',
    time: '1h',
    type: 'phone',
    avatar: {
      letter: 'P',
      color: 'bg-purple-500'
    },
    status: 'active'
  }
] 
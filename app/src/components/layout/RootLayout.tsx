import { Header } from '../Header'
import { Outlet } from 'react-router-dom'
import { Toaster } from '../ui/toaster'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
} 
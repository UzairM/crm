import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ory } from '../lib/ory'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { useAuthStore } from '../stores/auth'
import { useUIStore } from '../stores/ui'
import { useEffect } from 'react'
import type { Session } from '@ory/client'
import { LoadingSpinner } from '../components/LoadingSpinner'

export async function loader({ request }: { request: Request }) {
  try {
    // Get the session from ORY using native flow
    const cookie = request.headers.get('cookie')
    if (!cookie) {
      throw new Error('No session cookie found')
    }

    // Use native flow to verify session
    const { data: session } = await ory.toSession({
      cookie,
      xSessionToken: cookie.split('ory_session_token=')[1]?.split(';')[0],
    })
    
    // If we have a session, return the user info
    if (!session?.identity?.traits?.email) {
      throw new Error('Invalid session data')
    }

    return json({
      session,
      user: {
        email: session.identity.traits.email,
      },
    })
  } catch (error) {
    // If no valid session, redirect to login
    return redirect('/login')
  }
}

export default function Dashboard() {
  const { user, session } = useLoaderData<typeof loader>()
  const setSession = useAuthStore((state) => state.setSession)
  const setUser = useAuthStore((state) => state.setUser)
  const setLoading = useUIStore((state) => state.setLoading)
  const isLoading = useUIStore((state) => state.isLoading)

  useEffect(() => {
    setLoading(true)
    try {
      if (session && session.identity) {
        setSession(session as Session)
        setUser({
          id: session.identity.id,
          email: session.identity.traits.email,
          role: 'None', // This will be updated when we implement role management
          fullName: null,
          isActive: true,
        })
      }
    } catch (error) {
      console.error('Error setting session:', error)
    } finally {
      setLoading(false)
    }
  }, [session, setSession, setUser, setLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user || !session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No user data available. Please log in again.</p>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold">Finance CRM</h1>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700">{user.email}</span>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <h2 className="text-2xl font-semibold text-gray-700">
                Welcome to your dashboard
              </h2>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 
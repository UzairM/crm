import { json } from '@remix-run/node'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { useAuthStore } from '../stores/auth'
import { useHydrated } from '../hooks/useHydrated'

export async function loader() {
  // Just return empty data, ProtectedRoute will handle session check
  return json({})
}

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const session = useAuthStore((state) => state.session)
  const isHydrated = useHydrated()

  console.log('Dashboard render:', { 
    user, 
    session: session?.identity?.id,
    isHydrated 
  })

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
                {isHydrated ? (
                  <span className="text-gray-700">{user?.email || ''}</span>
                ) : null}
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
import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { useEffect } from 'react'
import { ory } from '../lib/ory'
import { useAuthStore } from '../stores/auth'
import { useUIStore } from '../stores/ui'

export async function loader() {
  try {
    // Initialize a new login flow
    const { data: flow } = await ory.createNativeLoginFlow({
      aal: 'aal1',
    })
    return json({ flow })
  } catch (error) {
    return redirect('/login')
  }
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const csrf_token = formData.get('csrf_token') as string

  try {
    const { data: flow } = await ory.createNativeLoginFlow({
      aal: 'aal1',
    })

    const { data: session } = await ory.updateLoginFlow({
      flow: flow.id,
      updateLoginFlowBody: {
        csrf_token,
        identifier: email,
        password,
        method: 'password',
      },
    })

    return redirect('/dashboard', {
      headers: {
        'Set-Cookie': `ory_session_token=${session.session_token}`,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      return json({ error: error.message })
    }
    return json({ error: 'Invalid email or password' })
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>()
  const setUser = useAuthStore((state) => state.setUser)
  const setLoading = useUIStore((state) => state.setLoading)
  const setError = useUIStore((state) => state.setError)

  useEffect(() => {
    if (actionData?.error) {
      setError(actionData.error)
    }
  }, [actionData, setError])

  useEffect(() => {
    setUser(null)
  }, [setUser])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form method="post" className="space-y-6" onSubmit={() => setLoading(true)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <input type="hidden" name="csrf_token" value="test-csrf-token" />

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
} 
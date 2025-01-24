import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import type { LinksFunction } from "@remix-run/node"
import { useAuthStore } from './stores/auth'
import { useEffect } from 'react'
import { ErrorAlert } from './components/ErrorAlert'
import { Modal } from './components/Modal'
import tailwindStyles from './tailwind.css'

// Declare global window ENV
declare global {
  interface Window {
    ENV: {
      ORY_BASE_URL: string
    }
  }
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: 'stylesheet', href: tailwindStyles },
];

export async function loader() {
  return json({
    ENV: {
      ORY_BASE_URL: process.env.ORY_BASE_URL,
    },
  })
}

export default function App() {
  const data = useLoaderData<typeof loader>()
  const setSession = useAuthStore((state) => state.setSession)
  const setUser = useAuthStore((state) => state.setUser)

  // Reset auth state when app mounts
  useEffect(() => {
    setSession(null)
    setUser(null)
  }, [setSession, setUser])

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <ErrorAlert />
        <Modal />
        <Outlet />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

/**
 * ORY SDK Configuration & Client
 * 
 * Configures and exports the ORY Kratos Frontend API client for authentication and identity management.
 * The client is configured to communicate with the ORY instance specified in VITE_ORY_SDK_URL env var.
 * 
 * Features:
 * - Pre-configured ORY Frontend API client
 * - Automatic cookie handling with withCredentials
 * - Environment-based ORY instance URL configuration
 * 
 * @example
 * ```tsx
 * import { ory } from '@/lib/ory'
 * 
 * // Get the current session
 * const session = await ory.toSession()
 * 
 * // Get login flow
 * const flow = await ory.createBrowserLoginFlow()
 * 
 * // Get registration flow  
 * const flow = await ory.createBrowserRegistrationFlow()
 * ```
 */

import { Configuration, FrontendApi } from '@ory/client'

// Initialize the ORY SDK with the base URL
const ory = new FrontendApi(
  new Configuration({
    basePath: import.meta.env.VITE_ORY_SDK_URL || 'http://localhost:4000',
    baseOptions: {
      withCredentials: true,
    },
  })
)

export { ory } 
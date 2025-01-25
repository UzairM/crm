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
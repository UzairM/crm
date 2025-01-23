import { Configuration, FrontendApi } from '@ory/client'

// Initialize the ORY SDK with the base URL from environment variables
const oryBaseUrl = typeof window !== 'undefined' 
  ? window.ENV.ORY_BASE_URL 
  : process.env.ORY_BASE_URL

if (!oryBaseUrl) {
  throw new Error('ORY_BASE_URL environment variable is not set')
}

const configuration = new Configuration({
  basePath: oryBaseUrl,
  baseOptions: {
    withCredentials: true,
  },
})

// Create and export the frontend API instance
export const ory = new FrontendApi(configuration) 
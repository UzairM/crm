import { Configuration, FrontendApi } from '@ory/client'

// Initialize the ORY SDK with the base URL
const ory = new FrontendApi(
  new Configuration({
    basePath: process.env.ORY_SDK_URL || 'https://auth.elphinstone.us',
    baseOptions: {
      withCredentials: true,
    },
  })
)

export { ory } 
import app from './app'
import { config } from './config/env'

// Start server
app.listen(config.port, () => {
  console.log(`Core CRM service listening at http://localhost:${config.port}`)
}) 
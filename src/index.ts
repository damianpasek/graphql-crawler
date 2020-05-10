import config from './config'
import { getServer } from './server'

(async () => {
  const httpServer = await getServer()
  httpServer.listen(
    config.port,
    () => console.log(`GraphQL server started on port ${config.port}`),
  )
})()

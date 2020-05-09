import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'
import { createServer } from 'http'

import config from './config'
import { UrlsResolver } from './resolvers'

(async () => {
  const schema = await buildSchema({
    resolvers: [UrlsResolver],
  })

  const app = express()
  const httpServer = createServer(app)
  const server = new ApolloServer({ schema })

  server.applyMiddleware({ app })
  server.installSubscriptionHandlers(httpServer)

  httpServer.listen(
    config.port,
    () => console.log(`GraphQL server started on port ${config.port}`),
  )
})()

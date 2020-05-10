import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { createServer } from 'http'

import { createSchema } from './utils/createSchema'
import { createDbConnection } from './config/db'

export const getServer = async () => {
  await createDbConnection()
  const schema = await createSchema()

  const app = express()
  const httpServer = createServer(app)
  const server = new ApolloServer({ schema })

  server.applyMiddleware({ app })
  server.installSubscriptionHandlers(httpServer)

  return httpServer
}

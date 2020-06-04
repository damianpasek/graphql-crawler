import { buildSchema } from 'type-graphql'

import { UrlsResolver } from '../resolvers'

export const createSchema = async () =>
  buildSchema({
    resolvers: [UrlsResolver],
  })

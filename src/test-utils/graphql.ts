import 'reflect-metadata'
import { graphql } from 'graphql'

import { createSchema } from '../utils/createSchema'

interface IOptions {
  source: string
  variableValues: any
}

export const callGraphQL = async ({ source, variableValues }: IOptions) => {
  const schema = await createSchema()

  return graphql({ schema, source, variableValues })
}

import { createConnection, getConnection, getConnectionOptions, Connection } from 'typeorm'

import { Website } from '../entities/Website'

export const createDbConnection = async (): Promise<Connection> => {
  const connectionName = process.env.NODE_ENV === 'test' ? 'test' : 'default'
  const { name, ...options } = await getConnectionOptions(connectionName)

  const connection = await createConnection({
    ...options,
    entities: [
      Website,
    ],
  })

  return connection
}

export const closeDbConnection = async () => getConnection().close()

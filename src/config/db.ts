import { createConnection } from 'typeorm'

import { Website } from '../entities/Website'

export const createDbConnection = async () => {
  const connection = createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3308,
    username: 'crawler',
    password: 'crawler',
    database: 'crawler',
    entities: [
      Website,
    ],
  })
  return connection
}

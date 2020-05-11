const base = {
  database: 'crawler',
  migrations: [
    'src/migrations/*.ts',
  ],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
  },
}

module.exports = [
  {
    ...base,
    name: 'default',
    type: 'mysql',
    url: process.env.DATABASE_URL || 'mysql://crawler:crawler@127.0.0.1:3308/crawler',
  },
  {
    ...base,
    name: 'test',
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
  },
]

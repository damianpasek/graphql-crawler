const base = {
  // TypeORM has a bug. Database option here is redundant but cannot be removed
  database: 'database',
  migrations: [
    'src/migrations/*.js',
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
    url: 'sqlite://:memory:',
    dropSchema: true,
    synchronize: true,
  },
]

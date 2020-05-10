module.exports = {
  type: 'mysql',
  host: 'localhost',
  port: 3308,
  username: 'crawler',
  password: 'crawler',
  database: 'crawler',
  entities: [
    'src/entities/Website.ts',
  ],
  migrations: [
    'src/migrations/*.ts',
  ],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
  },
}

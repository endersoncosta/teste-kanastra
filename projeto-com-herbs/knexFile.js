module.exports = {
    development: {
      client: 'postgresql',
      connection: {
        database: 'debtengine',
        user: 'postgres',
        password: 'somePassword',
        host: '127.0.0.1',
        port: 5432
      },
      migrations: {
        directory: './src/infra/data/database/migrations',
        tableName: 'knex_migrations'
      }
    },
    staging: {},
    production: {}

  }

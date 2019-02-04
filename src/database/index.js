const Knex = require('knex')
const transaction = require('objection').transaction
const postgres = require('../config/env').postgres

const postgresConfig = {
  client: 'pg',
  connection: postgres,
  searchPath: ['knex', 'public']
}

const knex = Knex(postgresConfig)

const postgresDB = class PostgresDB {
  static get Connection () {
    if (!this.connection) {
      this.connection = Knex(postgresConfig)
    }
    return this.connection
  }

  static startTransaction () {
    return transaction.start(knex)
  }

  static async migrate () {
    const migrationKnex = await PostgresDB.getMigrations()
    await migrationKnex.migrate.latest()
    await migrationKnex.destroy()
  }

  static getMigrations () {
    const migrationConfig = {
      ...postgresConfig,
      migrations: {
        directory: Path.normalize(`${__dirname}/migrations`),
        tableName: 'knex_migrations'
      }
    }
    return Knex(migrationConfig)
  }
}

module.exports = { postgresDB, knex }

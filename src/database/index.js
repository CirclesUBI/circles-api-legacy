import Knex from 'knex';
import { transaction } from 'objection';
import { postgres } from '../config/env';

const postgresConfig = {
  client: 'pg',
  connection: postgres,
  searchPath: ['knex', 'public']
}

export const knex = Knex(postgresConfig);

export default class PostgresDB {

  static get Connection() {
    if (!this.connection) {
      this.connection = Knex(postgresConfig);
    }
    return this.connection;
  }

  static startTransaction() {
    return transaction.start(knex);
  }

  static async migrate() {
    const migrationKnex = await PostgresDB.getMigrations();
    await migrationKnex.migrate.latest();
    await migrationKnex.destroy();
  }

  static getMigrations() {
    const migrationConfig = {
      ...postgresConfig,
      migrations: {
        directory: Path.normalize(`${__dirname}/migrations`),
        tableName: 'knex_migrations'
      }
    };
    return Knex(migrationConfig);
  }
}

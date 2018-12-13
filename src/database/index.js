import Knex from 'knex';
import * as Path from 'path';

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
    return new Promise((resolve, reject) => {
      return PostgresDB.Connection.transaction(trx => {
        return resolve(trx);
      }).catch(reject);
    })
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

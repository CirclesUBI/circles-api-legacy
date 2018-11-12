import { Model, snakeCaseMappers } from 'objection';
import pg from 'pg';
import BigNumber from 'bignumber.js';
import postgresKnex from '../connections/postgres';

// Defaults for all models
class CirclesModel extends Model {

  // map camelCase attributes to snake_case db fields
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  // On insert/update, ignore properties on a Model that aren't defined in the schema
  static get pickJsonSchemaProperties() {
    return true;
  }

  // Don't automatically assume that Model properties of type Object are json blobs
  // They might be BigNumbers or Dates
  static get jsonAttributes() {
    return [];
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}

// Set db connection info for the default model.
CirclesModel.knex(postgresKnex);

// Configure pg to parse data from Postgres Numeric (Decimal) columns into BigNumber instances upon retrieval
const NUMERIC_OID = 1700;
const parse = (string) => {
  return string ? new BigNumber(string) : null;
};
pg.types.setTypeParser(NUMERIC_OID, parse);

export default CirclesModel;

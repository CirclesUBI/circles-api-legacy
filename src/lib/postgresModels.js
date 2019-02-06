const Model = require('objection').Model
const snakeCaseMappers = require('objection').snakeCaseMappers
const pg = require('pg')
const BigNumber = require('bignumber.js')
const knex = require('../database').knex

// Defaults for all models
class CirclesModel extends Model {
  // On insert/update, ignore properties on a Model that aren't defined in the schema
  static get pickJsonSchemaProperties () {
    return true
  }

  // Don't automatically assume that Model properties of type Object are json blobs
  // They might be BigNumbers or Dates
  static get jsonAttributes () {
    return []
  }

  $beforeUpdate () {
    this.updated_at = new Date().toISOString()
  }

  $beforeInsert () {
    this.created_at = new Date().toISOString()
    this.updated_at = new Date().toISOString()
  }
}

// Set db connection info for the default model.
CirclesModel.knex(knex)

// Configure pg to parse data from Postgres Numeric (Decimal) columns into BigNumber instances upon retrieval
const NUMERIC_OID = 1700
const parse = string => {
  return string ? new BigNumber(string) : null
}
pg.types.setTypeParser(NUMERIC_OID, parse)

module.exports = CirclesModel

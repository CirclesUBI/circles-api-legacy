const Knex = require('knex')(require('../../knexfile'))
const postgres = require('../config/env').postgres

module.exports = Knex({
  client: 'pg',
  connection: postgres,
  searchPath: ['knex', 'public']
})

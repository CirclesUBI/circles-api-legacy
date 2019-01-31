const Knex = require('knex')(require('../../knexfile'))
const postgres = require('../config/env')

console.log('at index:', knex);

module.exports = Knex({
  client: 'pg',
  connection: postgres,
  searchPath: ['knex', 'public']
});

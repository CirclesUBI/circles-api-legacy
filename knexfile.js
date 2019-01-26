require('dotenv').config()
const { postgres } = require('./src/config/env')

module.exports = {
  client: 'pg',
  connection: postgres,
  migrations: {directory: './src/migrations'},
  seeds: {directory: './src/seeds'}
}

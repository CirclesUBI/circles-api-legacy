require('dotenv').config();
const { postgres } = require('./build/config/env');

module.exports = {
  client: 'pg',
  connection: postgres,
  migrations: {
    directory: './build/migrations'
  }
};

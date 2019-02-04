const express = require('express')
const routes = require('./routes')
const log = require('./lib/logger')
const port = require('./config/env').port
const knex = require('./database').knex

const getDBTime = async () => {
  const res = await knex.raw('SELECT NOW()')
  return res.rows[0].now;
}

const app = express();
routes(app);

app.listen(port, async (err) => {
  if (err) log.error(err);
  else log.info(`Ed Julio & Sarah are listening on :${port}`);

  // database check, can be removed soon
  const dbTime = await getDBTime();
  log.info(`Database time is ${dbTime}`);
});

module.exports = app

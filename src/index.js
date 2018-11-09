import express from 'express';
import routes from './config/routes';
import log from './lib/logger';
import { port } from './config/env';

const { Pool } = require('pg');
// pools will use environment variables
// for connection information
const pool = new Pool();

async function getDBTime () {
  console.log('pool query');
  const res = await pool.query('SELECT NOW()');
  await pool.end();
  console.log('pool query res', res);
  return res;
}

const app = express();

routes(app);

app.listen(port, (err) => {
  if (err) log.error(err);
  else log.info(`Ed Julio & Sarah are listening on :${port}`);

  log.info('getDBTime', getDBTime());
});

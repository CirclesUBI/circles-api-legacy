import express from 'express';
import routes from './routes';
import log from './lib/logger';
import { port } from './config/env';
import PostgresDB from './database';

// const getDBTime = async () => {
//   const res = await PostgresDB.raw('SELECT NOW()')
//   return res.rows[0].now;
// }

const app = express();
routes(app);

app.listen(port, async (err) => {
  if (err) log.error(err);
  else log.info(`Ed Julio & Sarah are listening on :${port}`);

  // database check, can be removed soon
  // const dbTime = await getDBTime();
  // log.info(`Database time is ${dbTime}`);
});

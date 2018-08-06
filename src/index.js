import express from 'express';
import routes from './config/routes';
import log from './lib/logger';
import { port } from './config/env';

const app = express();

routes(app);
console.log('run')

app.listen(port, (err) => {
  console.log('called')
  if (err) log.error(err);
  else log.info(`Server listening on *:${port}`);
});

import express from 'express';
import routes from './config/routes';
import log from './lib/logger';
import { port } from './config/env';

const app = express();

routes(app);

app.listen(port, (err) => {
  if (err) log.error(err);
  else {
    log.info(`ECR deploy successful.`);
    log.info(`Server is now listening on :${port}`);
  }
});

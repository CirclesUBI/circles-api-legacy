import bodyParser from 'body-parser';
import authMiddleware from '../middleware/auth';
// import hasPermissionMiddleware from '../middleware/permissions';
import cors from 'cors';
import usersRouter from './usersRouter'
import orgsRouter from './orgsRouter'
import notifsRouter from './notifsRouter'

import { apiVersionString } from '../config/env'

export default function (app) {
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());  

  app.get('/', (req, res) => res.status(200).json('hello Ed!'));

  app.use(authMiddleware)
  app.use(apiVersionString + '/users', usersRouter)
  app.use(apiVersionString + '/orgs', orgsRouter)
  app.use(apiVersionString + '/notifs', notifsRouter)
}

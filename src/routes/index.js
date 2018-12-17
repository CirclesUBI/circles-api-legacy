import bodyParser from 'body-parser';
import authMiddleware from '../middleware/auth';
// import hasPermissionMiddleware from '../middleware/permissions';
import cors from 'cors';
import usersRouter from './usersRouter'
import orgsRouter from './orgsRouter'

const versionString = '/v1'

export default function (app) {
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());  

  app.get('/', (req, res) => res.status(200).json('hello Ed!'));
  
  app.use(authMiddleware)
  app.use(versionString + '/users', usersRouter)
  app.use(versionString + '/orgs', orgsRouter)
}


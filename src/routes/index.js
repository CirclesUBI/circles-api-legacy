import bodyParser from 'body-parser';
import authMiddleware from '../middleware/auth';
// import hasPermissionMiddleware from '../middleware/permissions';
import cors from 'cors';
// import userRouter from './userRouter'

// const versionString = '/v1'

export default function (app) {
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());  

  app.get('/', (req, res) => res.status(200).json('hello Ed!'));

  // define a separate router for this, if most calls end up being authenticated
  app.get('/test',
    authMiddleware,
    // hasPermissionMiddleware('ownUser', 'read'),
    (req, res) => res.status(200).json('Auth was successful!'));

  // app.use(versionString + '/user', userRouter)
}

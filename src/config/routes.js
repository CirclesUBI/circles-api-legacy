import bodyParser from 'body-parser';
import { defaultAppMsg } from './env';
import authMiddleware from '../middleware/auth';

export default function (app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.get('/', (req, res) => res.status(200).json(defaultAppMsg));

  // define a separate router for this, if most calls end up being authenticated
  app.get('/test', authMiddleware, (req, res) => res.status(200).json('Auth was successful!'));
  
}
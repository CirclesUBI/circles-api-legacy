import bodyParser from 'body-parser';
import { defaultAppMsg } from './env'

export default function (app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.get('/', (req, res) => res.status(200).json(defaultAppMsg));

}
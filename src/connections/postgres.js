import Knex from 'knex';
import { postgres } from '../config/environment';

export default Knex({
  client: 'pg',
  connection: postgres,
  searchPath: ['knex', 'public']
});

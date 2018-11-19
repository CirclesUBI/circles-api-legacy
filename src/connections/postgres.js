import Knex from 'knex';
import { postgres } from '../config/env';

export default Knex({
  client: 'pg',
  connection: postgres,
  searchPath: ['knex', 'public']
});

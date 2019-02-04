import * as HttpStatus from 'http-status-codes';

import PostgresDB from '../database';

import { HubContract } from '../connections/blockchain'

import logger from '../lib/logger'

async function signup (req, res) {
  try {
    await let receipt = HubContract.methods.signup(req.body.address, req.body.name)
    res.status(HttpStatus.OK).send();
  } catch (error) {
    logger.error(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

export default {signup}

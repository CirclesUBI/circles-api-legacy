const HttpStatus = require('http-status-codes');
const PostgresDB = require('../database').postgresDB;
const HubContract = require('../connections/blockchain')
const logger = require('../lib/logger');

async function signup (req, res) {
  try {
    const receipt = await HubContract.methods.signup(req.body.address, req.body.name)
    res.status(HttpStatus.OK).send();
  } catch (error) {
    logger.error(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
  }
}

module.exports = {
  signup
}

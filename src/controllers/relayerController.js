const HttpStatus = require('http-status-codes')
const PostgresDB = require('../database').postgresDB
const HubContract = require('../connections/blockchain')
const logger = require('../lib/logger')

async function callContract (req, res) {
  try {
    const method = HubContract.methods[req.params.contractName]
    if (typeof method !== 'function')
      throw new Error('no method: ' + req.params.contractName)
    const receipt = await method(req.body.address)
    res.status(HttpStatus.OK).send()
  } catch (error) {
    logger.error(error.message)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}

module.exports = {
  callContract
}

const HttpStatus = require('http-status-codes')
const ethSigner = require('eth-signer')
const PostgresDB = require('../database').postgresDB
const HubContract = require('../connections/blockchain')
const logger = require('../lib/logger')
const relayer = require('../lib/relayer')

async function callContract (req, res) {
  try {
    const result = await relayer.handle(req)
    //const txHash = await relayHandler.handle(req)
    logger.info('This the transactionHash', result)
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    let code = 500
    if (error.code) code = error.code
    let message = error
    if (error.message) message = error.message
    res.status(code).json({ status: 'error', message })
  }
}

module.exports = {
  callContract
}

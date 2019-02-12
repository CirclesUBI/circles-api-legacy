const HttpStatus = require('http-status-codes')
const ethSigner = require('ethsigner')
const PostgresDB = require('../database').postgresDB
const HubContract = require('../connections/blockchain')
const logger = require('../lib/logger')
const relayer = require('../lib/relayer')

  console.log('Call relay service')


async function callContract (req, res) {
  try {
    const txHash = await = relayer.handle(req)
    //const txHash = await relayHandler.handle(req)
    logger.info('This the transactionHash', txHash)
    if (req.body.jsonRpcReponse === true) {
      res.status(200).json({
        id: req.body.id,
        jsonrpc: '2.0',
        result: txHash
      })
    } else {
      res.status(200).json({ status: 'success', data: txHash })
    }
  } catch (error) {
    let code = 500
    if (error.code) code = error.code
    let message = error
    if (error.message) message = error.message
    if (req.body.jsonRpcReponse === true) {
      res
        .satus(code)
        .json({
          id: req.body.id,
          jsonrpc: '2.0',
          error: { code: -32600, message }
        })
    } else {
      res.satus(code).json({ status: 'error', message })
    }
  }


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

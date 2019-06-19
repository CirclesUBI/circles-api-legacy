const logger = require('../lib/logger')
const MetaTxHandler = require('metatx-server')
const apiPrivKey = process.env.API_PRIV_KEY
const {
  provider,
  txRelayAddress,
  txRelayABI
} = require('../connections/blockchain')

const metaTxHandler = new MetaTxHandler(
  apiPrivKey,
  provider,
  txRelayAddress,
  txRelayABI,
  logger
)

const relay = async (req, res) => {
  try {
    const result = await metaTxHandler.handle(req)
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
  relay
}

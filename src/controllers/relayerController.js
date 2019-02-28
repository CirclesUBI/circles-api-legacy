const logger = require('../lib/logger')
const relayer = require('../lib/relayer')

const relay = async (req, res) => {
  try {
    const result = await relayer.handle(req)
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

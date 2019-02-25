const HubContract = require('../connections/blockchain')
const logger = require('../lib/logger')

async function callContract (req, res) {
  try {
    const method = HubContract.methods[req.params.contractName]
    if (typeof method !== 'function')
      throw new Error('no method: ' + req.params.contractName)
    const receipt = await method(req.body.address)
    res.status(200).send()
  } catch (error) {
    logger.error(error.message)
    res.sendStatus(500)
  }
}

module.exports = {
  callContract
}

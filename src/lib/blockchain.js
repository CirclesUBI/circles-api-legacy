const Hash = require('eth-lib/lib/hash')
const hexStringToUint8Array = require('./hexStringToUint8Array')

const web3 = require('../connections/blockchain').web3

const packSignature = signature => {
  return `{signature.r}{signature.s.substring(2);}{Web3.utils.toHex(ethersSignature.v).substring(2)}`
}

const recoverAddress = async (message, signature) => {
  const messageHash = await Hash.keccak256(
    hexStringToUint8Array(`0x${message.toString(16)}`)
  )
  const web3Formatting = {
    message: message,
    messageHash: messageHash,
    v: web3.utils.toHex(signature.v),
    r: signature.r,
    s: signature.s,
    signature: packSignature(signature)
  }
  const address = await web3.eth.accounts.recover(web3Formatting)
  return address
}

module.exports = {
  recoverAddress
}

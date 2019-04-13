const Web3 = require('web3')
const ethers = require('ethers')
const Hash = require('eth-lib/lib/hash')
const Account = require('eth-lib/lib/account')
const hexStringToUint8Array = require('../lib/hexStringToUint8Array')
const HubContractJSON = require('../../contracts/build/contracts/Hub.json')
const TxRelayContractJSON = require('../../contracts/build/contracts/TxRelay.json')

const rpcUrl = require('../config/env').rpcUrl
const provider = new Web3.providers.HttpProvider(rpcUrl)
const web3 = new Web3(provider)

const txRelayAddress =
  TxRelayContractJSON.networks[process.env.NETWORK_ID].address ||
  process.env.RELAY_CONTRACT_ADDRESS
const txRelayABI = TxRelayContractJSON.abi

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
    v: Web3.utils.toHex(signature.v),
    r: signature.r,
    s: signature.s,
    signature: packSignature(signature)
  }
  const address = await web3.eth.accounts.recover(web3Formatting)
  return address
}

module.exports = {
  provider,
  recoverAddress,
  txRelayAddress,
  txRelayABI
}

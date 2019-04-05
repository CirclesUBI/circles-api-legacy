const Web3 = require('web3')
const HubContractJSON = require('../../contracts/build/contracts/Hub.json')
const TxRelayContractJSON = require('../../contracts/build/contracts/TxRelay.json')

const rpcUrl = require('../config/env').rpcUrl
const provider = new Web3.providers.HttpProvider(rpcUrl)
const web3 = new Web3(provider)

const txRelayAddress =
  TxRelayContractJSON.networks[process.env.NETWORK_ID].address ||
  process.env.RELAY_CONTRACT_ADDRESS
const txRelayABI = TxRelayContractJSON.abi

const recoverAddress = async (message, signature, key) => {  

  let s = await web3.eth.accounts.sign(String(message), key)
  console.log('eth sig', signature)
  console.log('web3 sig', s)


  const messageHash = await web3.eth.accounts.hashMessage(String(message))
  
  // signature Object {
  //   "r": "0x5bd1a8a4e75432ed8f608f3b5a99274235b0de4bd6ab66b6a414d98a471defea",
  //   "recoveryParam": 0,
  //   "s": "0x3560058932986bd7cf8b06eb4614e8588e41dd6552aa41689a0f63bd393fd461",
  //   "v": 27,
  // }

  let signatureObject = {
    messageHash: messageHash,
    v: Web3.utils.toHex(signature.v), //27 in hex
    r: String(signature.r),
    s: String(signature.s)
  }
  console.log('signatureObject', signatureObject)

  return web3.eth.accounts.recover(s)
}

module.exports = {
  provider,
  recoverAddress,
  txRelayAddress,
  txRelayABI
}

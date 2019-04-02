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

const recoverAddress = async (message, signature) => {
  const messageHash = await web3.eth.accounts.hashMessage(message)
  // {
  //    recoveryParam: 0,
  //    r: "0x79f56f3422dc67f57b2aeeb0b20295a99ec90420b203177f83d419c98beda7fe",
  //    s: "0x1a9d05433883bdc7e6d882740f4ea7921ef458a61b2cfe6197c2bb1bc47236fd"
  // }

  return web3.eth.accounts.recover({
    messageHash: messageHash,
    v: 27 + signature.recoveryParam, // weeeeird
    r: signature.r,
    s: signature.s
  })
}

module.exports = {
  provider,
  recoverAddress,
  txRelayAddress,
  txRelayABI
}

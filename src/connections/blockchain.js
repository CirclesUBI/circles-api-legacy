const Web3 = require('web3')
const HubContractJSON = require('../../contracts/build/contracts/Hub.json')
const TxRelayContractJSON = require('../../contracts/build/contracts/TxRelay.json')

const rpcUrl = require('../config/env').rpcUrl
const provider = new Web3.providers.HttpProvider(rpcUrl)
const web3 = new Web3(provider)

console.log('process.env.NETWORK_ID', process.env.NETWORK_ID)

const txRelayAddress =
  TxRelayContractJSON.networks[process.env.NETWORK_ID].address ||
  process.env.RELAY_CONTRACT_ADDRESS
const txRelayABI = TxRelayContractJSON.abi

module.exports = {
  provider,
  txRelayAddress,
  txRelayABI
}

const Web3 = require('web3')
const HubContractJSON = require('../../contracts/build/contracts/Hub.json')
const TxRelayContractJSON = require('../../contracts/build/contracts/TxRelay.json')

const rpcUrl = require('../config/env').rpcUrl
const provider = new Web3.providers.WebsocketProvider(rpcUrl)
const web3 = new Web3(provider)

const txRelayAddress =
  TxRelayContractJSON.networks[process.env.NETWORK_ID].address ||
  process.env.RELAY_CONTRACT_ADDRESS
const txRelayABI = TxRelayContractJSON.abi

module.exports = {
  web3,
  provider,
  txRelayAddress,
  txRelayABI
}

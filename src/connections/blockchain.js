const Web3 = require('web3')
const HubContractJSON = require('../../contracts/build/contracts/Hub.json')
const TxRelayContractJSON = require('../../contracts/build/contracts/TxRelay.json')
const logger = require('../lib/logger')
const rpcUrl = require('../config/env').rpcUrl

const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))

const HubAddress = process.env.HUB_CONTRACT_ADDRESS
const TxRelayAddress =
  TxRelayContractJSON.networks[process.env.NETWORK_ID].address ||
  process.env.RELAY_CONTRACT_ADDRESS

const HubContract = new web3.eth.Contract(HubContractJSON.abi, HubAddress)

const TxRelayContract = new web3.eth.Contract(
  TxRelayContractJSON.abi,
  TxRelayAddress
)

module.exports = {
  web3,
  HubContract,
  TxRelayContract
}
